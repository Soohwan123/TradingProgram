#include "dma_common.h"

// 외부 워커 스레드 함수
extern void* workerThread(void* arg);

int main() {
    // 싱글턴 초기화
    const char* uri = "mongodb+srv://USER:PASS@trading.rlykj.mongodb.net/?retryWrites=true&w=majority&appName=Trading";
    initMongo(uri, "stockmarket");

    int serverSock;
    struct sockaddr_in serverAddr;

    // 1) 소켓 준비
    serverSock = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSock < 0) {
        perror("[DMA Main] socket error");
        exit(1);
    }

    int opt = 1;
    setsockopt(serverSock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family      = AF_INET;
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    serverAddr.sin_port        = htons(DMA_PORT);

    if (bind(serverSock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("[DMA Main] bind error");
        exit(1);
    }

    if (listen(serverSock, BACKLOG) < 0) {
        perror("[DMA Main] listen error");
        exit(1);
    }

    printf("[DMA Main] Listening on port %d\n", DMA_PORT);

    // 2) 스레드 풀 초기화
    static TaskQueue queue;
    memset(&queue, 0, sizeof(queue));
    pthread_mutex_init(&queue.mutex, NULL);
    pthread_cond_init(&queue.cond, NULL);

    // 워커 스레드 생성
    pthread_t workers[MAX_WORKERS];
    for (int i = 0; i < MAX_WORKERS; i++) {
        pthread_create(&workers[i], NULL, workerThread, (void*)&queue);
        pthread_detach(workers[i]);
    }

    // 3) accept loop
    while (1) {
        struct sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);
        int clientSock = accept(serverSock, (struct sockaddr*)&clientAddr, &clientLen);
        if (clientSock < 0) {
            perror("[DMA Main] accept error");
            continue;
        }
        printf("[DMA Main] New connection accepted\n");

        // 4) 작업 큐에 등록
        enqueueTask(&queue, clientSock);
    }

    close(serverSock);
    finalizeMongo();
    return 0;
}
