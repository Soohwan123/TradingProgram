#include <stdlib.h>
#include "fep.h"
#include "order.h"

int checkRisk(const Order* o) {
    if (o->quantity <= 0 || o->price <= 0) {
        printf("[FEP] Invalid quantity/price\n");
        return 0;
    }
    return 1;
}

void enqueueTask(TaskQueue* queue, int clientSock) {
    TaskNode* newNode = (TaskNode*)malloc(sizeof(TaskNode));
    newNode->clientSock = clientSock;
    newNode->next = NULL;

    pthread_mutex_lock(&queue->mutex);
    if (queue->tail == NULL) {
        queue->head = newNode;
        queue->tail = newNode;
    } else {
        queue->tail->next = newNode;
        queue->tail = newNode;
    }
    pthread_cond_signal(&queue->cond);
    pthread_mutex_unlock(&queue->mutex);
}

int dequeueTask(TaskQueue* queue) {
    pthread_mutex_lock(&queue->mutex);
    while (queue->head == NULL) {
        // 대기 (작업이 들어올 때까지)
        pthread_cond_wait(&queue->cond, &queue->mutex);
    }
    TaskNode* front = queue->head;
    int clientSock = front->clientSock;

    queue->head = front->next;
    if (queue->head == NULL) {
        queue->tail = NULL;
    }

    free(front);
    pthread_mutex_unlock(&queue->mutex);
    return clientSock;
}