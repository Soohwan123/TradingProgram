package com.stockmarket.service;

import com.stockmarket.model.StockData;
import com.stockmarket.repository.StockDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 주식 데이터 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class StockDataService {
    private final StockDataRepository stockDataRepository;

    @Autowired
    public StockDataService(StockDataRepository stockDataRepository) {
        this.stockDataRepository = stockDataRepository;
    }

    /**
     * 심볼로 주식 데이터 조회
     */
    public StockData findBySymbol(String symbol) {
        return stockDataRepository.findBySymbol(symbol)
            .orElseThrow(() -> new RuntimeException("Stock data not found for symbol: " + symbol));
    }

    /**
     * 새로운 주식 데이터 저장
     */
    public StockData saveStockData(StockData stockData) {
        return stockDataRepository.save(stockData);
    }

    /**
     * 특정 가격 이상의 주식 데이터 조회
     */
    public List<StockData> findStocksAbovePrice(Double price) {
        return stockDataRepository.findByCurrentPriceGreaterThan(price);
    }
} 