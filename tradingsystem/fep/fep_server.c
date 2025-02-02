#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <pthread.h>
#include "fep.h"

extern void* workerThread(void* arg);

int main() {
    int serverSock;
    struct sockaddr_in serverAddr;

    // 1) 서버 소켓 준비
    serverSock = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSock < 0) {
        perror("socket error");
        exit(1);
    }

    int opt = 1;
    setsockopt(serverSock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family      = AF_INET;
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    serverAddr.sin_port        = htons(FEP_PORT);

    if (bind(serverSock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("bind error");
        exit(1);
    }

    if (listen(serverSock, BACKLOG) < 0) {
        perror("listen error");
        exit(1);
    }

    printf("[FEP Main] Listening on port %d\n", FEP_PORT);

    // 2) 스레드 풀 초기화
    static TaskQueue g_queue;
    memset(&g_queue, 0, sizeof(g_queue));
    pthread_mutex_init(&g_queue.mutex, NULL);
    pthread_cond_init(&g_queue.cond, NULL);

    // 워커 스레드 생성
    pthread_t workers[MAX_WORKERS];
    for (int i = 0; i < MAX_WORKERS; i++) {
        pthread_create(&workers[i], NULL, workerThread, (void*)&g_queue);
        pthread_detach(workers[i]);
    }

    // 3) accept loop
    while (1) {
        struct sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);
        int clientSock = accept(serverSock, (struct sockaddr*)&clientAddr, &clientLen);
        if (clientSock < 0) {
            perror("[FEP Main] accept error");
            continue;
        }
        printf("[FEP Main] New connection accepted\n");

        // 4) 작업 큐에 소켓 등록 -> 워커 스레드가 처리
        enqueueTask(&g_queue, clientSock);
    }

    close(serverSock);
    return 0;
}
