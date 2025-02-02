#ifndef COMMON_H
#define COMMON_H

#include <liburing.h>
#include <pthread.h>

#define QUEUE_DEPTH   64
#define MAX_WORKERS   8   
#define BACKLOG       128
#define FEP_PORT      9001
#define DMA_IP     "127.0.0.1"  // DMA 서버 IP
#define DMA_PORT   9100         // DMA 서버 포트
#define SYMBOL_LEN 10

// 주문 구조체
typedef struct {
    char symbol[SYMBOL_LEN]; //종목
    int quantity;           
    double price;
    int orderId;
    int userId;
} Order;

// 작업 큐 노드
typedef struct TaskNode {
    int clientSock;
    struct TaskNode* next;
} TaskNode;

// 스레드 풀에서 사용할 큐 구조체
typedef struct {
    TaskNode* head;
    TaskNode* tail;
    pthread_mutex_t mutex;
    pthread_cond_t  cond;
} TaskQueue;

// 함수 선언
void enqueueTask(TaskQueue* queue, int clientSock);
int  dequeueTask(TaskQueue* queue);

#endif