#include <stdio.h>
#include <stdlib.h>
#include "dma_common.h"

void enqueueTask(TaskQueue* queue, int clientSock) {
    TaskNode* newNode = (TaskNode*)malloc(sizeof(TaskNode));
    newNode->clientSock = clientSock;
    newNode->next = NULL;

    pthread_mutex_lock(&queue->mutex);
    if (!queue->tail) {
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
        pthread_cond_wait(&queue->cond, &queue->mutex);
    }
    TaskNode* front = queue->head;
    int sock = front->clientSock;
    
    queue->head = front->next;
    if (!queue->head) {
        queue->tail = NULL;
    }
    free(front);
    pthread_mutex_unlock(&queue->mutex);
    return sock;
}
