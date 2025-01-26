package com.stockmarket.repository;

import com.stockmarket.model.StockData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * StockData 엔티티에 대한 데이터베이스 작업을 처리하는 리포지토리
 */
@Repository
public interface StockDataRepository extends MongoRepository<StockData, String> {
    // 주식 심볼로 데이터 찾기
    Optional<StockData> findBySymbol(String symbol);
    
    // 현재 가격이 특정 값보다 큰 주식 데이터 목록 찾기
    List<StockData> findByCurrentPriceGreaterThan(Double price);
    
    // 심볼로 주식 데이터 존재 여부 확인
    boolean existsBySymbol(String symbol);
} 