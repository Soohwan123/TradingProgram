# Makefile for building FEP and DMA servers
# -----------------------------------------

# 1) 컴파일러/옵션 설정
CC       = gcc
CFLAGS   = -Wall -Wextra -O2 -g
# io_uring, libmongoc, libbson 링크
LDLIBS   = -luring -lmongoc-1.0 -lbson-1.0

# 2) 소스 파일 정의

# FEP 쪽 
FEP_SRCS = \
    fep/fep_helper.c \
    fep/fep_worker.c \
    fep/fep_server.c \

# DMA 쪽 
DMA_SRCS = \
    dma/dma_db.c \
    dma/dma_worker.c \
    dma/dma_task_queue.c \
    dma/dma_server.c \

# 오브젝트 파일 목록 (자동 변환)
FEP_OBJS = $(FEP_SRCS:.c=.o)
DMA_OBJS = $(DMA_SRCS:.c=.o)

# 3) 빌드 타겟

.PHONY: all clean

all: fep_server dma_server

# FEP 서버 빌드
fep_server: $(FEP_OBJS)
	$(CC) $(CFLAGS) -o $@ $(FEP_OBJS) $(LDLIBS)

# DMA 서버 빌드
dma_server: $(DMA_OBJS)
	$(CC) $(CFLAGS) -o $@ $(DMA_OBJS) $(LDLIBS)

# 4) 오브젝트 파일 규칙
%.o: %.c
	$(CC) $(CFLAGS) \
          -I. -I./common -I./fep -I./dma \
          -I/usr/include/libmongoc-1.0 \
          -I/usr/include/libbson-1.0 \
          -c $< -o $@

# 5) clean
clean:
	rm -f fep_server dma_server \
	      $(FEP_OBJS) $(DMA_OBJS)
