package com.stockmarket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

/**
 * 주식 데이터를 담는 모델 클래스
 * MongoDB의 stockdata 컬렉션과 매핑됨
 */
@Data
@Document(collection = "stockdata")
public class StockData {
    @Id
    private String id;
    
    private List<Double> timestamp;    // 시간 데이터
    private List<Double> indicators;   // 지표 데이터
    private String symbol;             // 주식 심볼
    private Double currentPrice;       // 현재 가격
}