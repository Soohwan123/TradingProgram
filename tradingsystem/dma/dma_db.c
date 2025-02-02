#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "dma_common.h"

// --------------------------------------------------
// 내부 정적 변수: MongoDB 클라이언트 싱글턴
// --------------------------------------------------
static bool              g_initialized = false;
static mongoc_client_t*  g_client      = NULL;  
static char              g_dbName[128] = {0};

// --------------------------------------------------
// 싱글턴 초기화 함수
// 프로그램 시작 시 한 번만 호출하면 됨
// --------------------------------------------------
void initMongo(const char* uriString, const char* dbName) {
    if (g_initialized) {
        // 이미 초기화됨
        return;
    }

    // libmongoc 전역 초기화
    mongoc_init();

    // MongoDB 클라이언트 생성
    g_client = mongoc_client_new(uriString);
    if (!g_client) {
        fprintf(stderr, "Failed to create MongoDB client.\n");
        // 심각 오류, 필요시 exit() 또는 예외 처리
        return;
    }

    // DB 이름 보관
    strncpy(g_dbName, dbName, sizeof(g_dbName)-1);

    g_initialized = true;

    printf("[Mongo Singleton] initMongo done. DB=%s\n", g_dbName);
}

// --------------------------------------------------
// 종료 처리(프로그램 종료 시)
// --------------------------------------------------
void finalizeMongo() {
    if (!g_initialized) return;

    if (g_client) {
        mongoc_client_destroy(g_client);
        g_client = NULL;
    }
    mongoc_cleanup();
    g_initialized = false;
    printf("[Mongo Singleton] finalizeMongo done.\n");
}

// --------------------------------------------------
// 실제 Insert 로직
// --------------------------------------------------
void insertOrderToDB(const Order* o) {
    if (!g_initialized || !g_client) {
        fprintf(stderr, "[DB] Mongo not initialized!\n");
        return;
    }

    // 1) DB, Collection 핸들 획득
    //    (멀티스레드 환경에서도 get_collection()은 안전,
    //     collection 핸들은 함수마다 생성→파괴를 권장)
    mongoc_database_t* db = mongoc_client_get_database(g_client, g_dbName);
    mongoc_collection_t* coll = mongoc_client_get_collection(g_client, g_dbName, "orders");

    // 2) BSON 문서 생성 (Order 구조체 -> MongoDB)
    bson_t* doc = bson_new();
    BSON_APPEND_UTF8(doc,  "symbol",   o->symbol);
    BSON_APPEND_INT32(doc, "quantity", o->quantity);
    BSON_APPEND_DOUBLE(doc,"price",    o->price);
    BSON_APPEND_INT32(doc, "orderId",  o->orderId);
    BSON_APPEND_INT32(doc, "userId",  o->userId);

    // 필요 시 timestamp, userId 등 추가
    // BSON_APPEND_DATE_TIME(doc, "createdAt", someTimestamp);

    // 3) Insert
    bson_error_t error;
    bool success = mongoc_collection_insert_one(coll, doc, NULL, NULL, &error);
    if (!success) {
        fprintf(stderr, "[DB] Insert failed: %s\n", error.message);
    } else {
        printf("[DB] Order inserted: %s %d @ %.2f\n", o->symbol, o->quantity, o->price);
    }

    // 4) 리소스 정리
    bson_destroy(doc);
    mongoc_collection_destroy(coll);
    mongoc_database_destroy(db);
}