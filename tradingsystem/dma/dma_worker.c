#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include "dma_common.h"

// wrk 디버그
static const char* HTTP_OK_RESP =
    "HTTP/1.1 200 OK\r\n"
    "Content-Type: text/plain\r\n"
    "Content-Length: 2\r\n"
    "\r\nOK";

void* workerThread(void* arg) {
    TaskQueue* queue = (TaskQueue*)arg;

    // 워커별 io_uring ring
    struct io_uring ring;
    io_uring_queue_init(QUEUE_DEPTH, &ring, 0);

    while (1) {
        // 1) 소켓 가져오기
        int clientSock = dequeueTask(queue);
        if (clientSock < 0) continue; // 에러 시 스킵

        // 2) 주문 수신 (비동기 recv)
        Order orderBuf;
        memset(&orderBuf, 0, sizeof(Order));

        struct io_uring_sqe* sqe = io_uring_get_sqe(&ring);
        if (!sqe) {
            fprintf(stderr, "[DMA Worker] No SQE available\n");
            close(clientSock);
            continue;
        }
        io_uring_prep_recv(sqe, clientSock, &orderBuf, sizeof(Order), 0);
        io_uring_sqe_set_data(sqe, &orderBuf);
        io_uring_submit(&ring);

        // 3) 완료 대기
        struct io_uring_cqe* cqe;
        int ret = io_uring_wait_cqe(&ring, &cqe);
        if (ret < 0) {
            fprintf(stderr, "[DMA Worker] io_uring_wait_cqe error: %d\n", ret);
            close(clientSock);
            continue;
        }

        int recvBytes = cqe->res;
        // //wrk 테스트
        // char* completedData = (char*)io_uring_cqe_get_data(cqe);

        Order* completedOrder = (Order*)io_uring_cqe_get_data(cqe);
        io_uring_cqe_seen(&ring, cqe);

        if (recvBytes <= 0) {
            printf("[DMA Worker] Client closed or error\n");
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

        // 4) DB 저장(가상)
        printf("[DMA Worker] Received from FEP: %s %d @ %.2f\n",
               completedOrder->symbol,
               completedOrder->quantity,
               completedOrder->price);
        
        // DB Insert
        insertOrderToDB(completedOrder);

        // 5) 응답 전송
        char msg[128];
        snprintf(msg, sizeof(msg), "Order Stored in DB (DMA)\n");
        send(clientSock, msg, strlen(msg), 0);

        close(clientSock);
    }

    io_uring_queue_exit(&ring);
    return NULL;
}
