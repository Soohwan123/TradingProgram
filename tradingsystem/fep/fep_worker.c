#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <fcntl.h>
#include <liburing.h>
#include "fep.h"


// wrk 디버그
static const char* HTTP_OK_RESP =
    "HTTP/1.1 200 OK\r\n"
    "Content-Type: text/plain\r\n"
    "Content-Length: 2\r\n"
    "\r\nOK";


// 외부 함수
extern int checkRisk(const Order* o);

// io_uring 헬퍼 함수: CQE 대기 & 결과 반환
static int wait_cqe_res(struct io_uring* ring, struct io_uring_cqe** cqeOut) {
    int ret = io_uring_wait_cqe(ring, cqeOut);
    if (ret < 0) {
        fprintf(stderr, "[FEP Worker] io_uring_wait_cqe error: %d\n", ret);
        return ret;
    }
    int res = (*cqeOut)->res;
    io_uring_cqe_seen(ring, *cqeOut);
    return res;
}

// DMA 전송 (io_uring 버전)
int forwardToDMA_iouring(struct io_uring* ring, const Order* o) {
    int sock = -1;
    struct sockaddr_in dmaAddr;
    struct io_uring_sqe* sqe;
    struct io_uring_cqe* cqe;

    // 1) 소켓 생성 (논블로킹)
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("[FEP Worker] socket error");
        return -1;
    }
    int flags = fcntl(sock, F_GETFL, 0);
    fcntl(sock, F_SETFL, flags | O_NONBLOCK);

    memset(&dmaAddr, 0, sizeof(dmaAddr));
    dmaAddr.sin_family      = AF_INET;
    dmaAddr.sin_addr.s_addr = inet_addr(DMA_IP);
    dmaAddr.sin_port        = htons(DMA_PORT);

    // 2) 비동기 connect 등록
    sqe = io_uring_get_sqe(ring);
    if (!sqe) {
        fprintf(stderr, "[FEP Worker] get_sqe error (connect)\n");
        close(sock);
        return -1;
    }
    io_uring_prep_connect(sqe, sock, (struct sockaddr*)&dmaAddr, sizeof(dmaAddr));
    io_uring_sqe_set_data(sqe, NULL);

    if (io_uring_submit(ring) < 0) {
        fprintf(stderr, "[FEP Worker] submit connect error\n");
        close(sock);
        return -1;
    }

    // 3) connect 완료 대기
    int ret = wait_cqe_res(ring, &cqe);
    if (ret < 0 || ret < 0) { // connect() 자체가 실패 시 음수
        fprintf(stderr, "[FEP Worker] connect failed (res=%d)\n", ret);
        close(sock);
        return -1;
    }
    printf("[FEP Worker] Connected to DMA.\n");

    // 4) 비동기 send(Order)
    sqe = io_uring_get_sqe(ring);
    if (!sqe) {
        fprintf(stderr, "[FEP Worker] get_sqe error (send)\n");
        close(sock);
        return -1;
    }
    // 실제로는 partial send 처리 필요 (여기선 단순화)
    io_uring_prep_send(sqe, sock, o, sizeof(Order), 0);
    io_uring_sqe_set_data(sqe, NULL);

    if (io_uring_submit(ring) < 0) {
        fprintf(stderr, "[FEP Worker] submit send error\n");
        close(sock);
        return -1;
    }

    ret = wait_cqe_res(ring, &cqe);
    if (ret < 0) {
        fprintf(stderr, "[FEP Worker] send failed (res=%d)\n", ret);
        close(sock);
        return -1;
    }
    printf("[FEP Worker] Sent Order -> symbol=%s, qty=%d, price=%.2f\n",
           o->symbol, o->quantity, o->price);

    // 5) 비동기 recv (DMA 응답)
    char buffer[256];
    memset(buffer, 0, sizeof(buffer));

    sqe = io_uring_get_sqe(ring);
    if (!sqe) {
        fprintf(stderr, "[FEP Worker] get_sqe error (recv)\n");
        close(sock);
        return -1;
    }
    io_uring_prep_recv(sqe, sock, buffer, sizeof(buffer)-1, 0);
    io_uring_sqe_set_data(sqe, NULL);

    if (io_uring_submit(ring) < 0) {
        fprintf(stderr, "[FEP Worker] submit recv error\n");
        close(sock);
        return -1;
    }

    ret = wait_cqe_res(ring, &cqe);
    if (ret > 0) {
        printf("[FEP Worker] DMA Response: %s\n", buffer);
    } else {
        fprintf(stderr, "[FEP Worker] No DMA response or recv error (res=%d)\n", ret);
    }

    close(sock);
    return 0;
}

void* workerThread(void* arg) {
    TaskQueue* queue = (TaskQueue*)arg;
    struct io_uring ring;
    io_uring_queue_init(QUEUE_DEPTH, &ring, 0);

    while (1) {
        int clientSock = dequeueTask(queue);
        if (clientSock < 0) continue;

        // ----------------------------
        // 1) 비동기 recv
        // ----------------------------
        // 기존엔 orderBuf에 직접 수신했으나,
        // HTTP 요청 문자열(“GET /…”)도 처리해야 하므로
        // 임시 버퍼로 받아야 한다.
        char recvBuf[1024];
        memset(recvBuf, 0, sizeof(recvBuf));

        struct io_uring_sqe* sqe = io_uring_get_sqe(&ring);
        if (!sqe) {
            fprintf(stderr, "[FEP Worker] No SQE available\n");
            close(clientSock);
            continue;
        }
        io_uring_prep_recv(sqe, clientSock, recvBuf, sizeof(recvBuf) - 1, 0);
        io_uring_sqe_set_data(sqe, recvBuf);
        io_uring_submit(&ring);

        struct io_uring_cqe* cqe;
        int ret = io_uring_wait_cqe(&ring, &cqe);
        if (ret < 0) {
            fprintf(stderr, "[FEP Worker] wait_cqe error: %d\n", ret);
            close(clientSock);
            continue;
        }

        int recvBytes = cqe->res;
        char* completedData = (char*)io_uring_cqe_get_data(cqe);
        io_uring_cqe_seen(&ring, cqe);

        if (recvBytes <= 0) {
            printf("[FEP Worker] Client closed or recv error\n");
            close(clientSock);
            continue;
        }

        // ----------------------------
        // wrk 테스트용
        // ----------------------------
        // wrk 등에서 오는 "GET /" 또는 "POST /" 등을 체크.
        if (!strncmp(completedData, "GET ", 4)  ||
            !strncmp(completedData, "POST ", 5)) {
            // 여기가 HTTP 요청이면 -> HTTP 200 간단 응답
            send(clientSock, HTTP_OK_RESP, strlen(HTTP_OK_RESP), 0);
            close(clientSock);
            continue;
        }

        // ----------------------------
        // 3) Order 처리 로직 (기존 코드)
        // ----------------------------
        // 받은 데이터가 Order 구조체라고 가정.
        // recvBuf → Order 로 변환
        if (recvBytes < (int)sizeof(Order)) {
            // 데이터가 부족하다면 잘못된 패킷 처리
            printf("[FEP Worker] Not enough data for an Order struct\n");
            close(clientSock);
            continue;
        }

        // 실전에서는 엔디안 문제 or JSON 파싱을 고려해야 하지만,
        // 여기서는 단순히 memcpy
        Order orderBuf;
        memcpy(&orderBuf, completedData, sizeof(Order));

        printf("[FEP Worker] Received order: %s %d @ %.2f\n",
               orderBuf.symbol, orderBuf.quantity, orderBuf.price);

        // 리스크 체크
        char msg[128];
        if (!checkRisk(&orderBuf)) {
            snprintf(msg, sizeof(msg), "Order Rejected by FEP\n");
            send(clientSock, msg, strlen(msg), 0);
        } else {
            // DMA 전송 (io_uring 버전)
            if (forwardToDMA_iouring(&ring, &orderBuf) == 0) {
                snprintf(msg, sizeof(msg), "Order Forwarded to DMA\n");
            } else {
                snprintf(msg, sizeof(msg), "DMA Forward Failed\n");
            }
            send(clientSock, msg, strlen(msg), 0);
        }

        close(clientSock);
    }

    io_uring_queue_exit(&ring);
    return NULL;
}