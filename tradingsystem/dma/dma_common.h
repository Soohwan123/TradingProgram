#ifndef DMA_COMMON_H
#define DMA_COMMON_H
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <pthread.h>
#include <liburing.h>
#include <pthread.h>
#include <mongoc/mongoc.h>

// DMA 서버 설정
#define DMA_PORT    9100
#define QUEUE_DEPTH 64
#define BACKLOG     128
#define MAX_WORKERS 4
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

// 작업 큐 구조체
typedef struct {
    TaskNode* head;
    TaskNode* tail;
    pthread_mutex_t mutex;
    pthread_cond_t  cond;
} TaskQueue;

// 함수 선언
void enqueueTask(TaskQueue* queue, int clientSock);
int  dequeueTask(TaskQueue* queue);


// 데이터 베이스 함수
// 싱글턴 초기화
void initMongo(const char* uriString, const char* dbName);
// 종료 처리(프로그램 종료 시)
void finalizeMongo();
// 주문 Insert 함수
void insertOrderToDB(const Order* o);

#endif
