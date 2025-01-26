package com.stockmarket.controller;

import com.stockmarket.model.StockData;
import com.stockmarket.service.StockDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

/**
 * 주식 데이터 관련 GraphQL 요청을 처리하는 컨트롤러
 */
@Controller
public class StockDataController {
    private final StockDataService stockDataService;

    @Autowired
    public StockDataController(StockDataService stockDataService) {
        this.stockDataService = stockDataService;
    }

    /**
     * 심볼로 주식 데이터 조회 쿼리
     */
    @QueryMapping
    public StockData stockData(@Argument String symbol) {
        return stockDataService.findBySymbol(symbol);
    }

    /**
     * 특정 가격 이상의 주식 데이터 조회 쿼리
     */
    @QueryMapping
    public List<StockData> stocksAbovePrice(@Argument Double price) {
        return stockDataService.findStocksAbovePrice(price);
    }
} 