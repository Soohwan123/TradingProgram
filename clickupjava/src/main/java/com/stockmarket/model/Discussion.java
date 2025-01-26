package com.stockmarket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * 토론/댓글 정보를 담는 모델 클래스
 * MongoDB의 discussions 컬렉션과 매핑됨
 */
@Data
@Document(collection = "discussions")
public class Discussion {
    @Id
    private String id;         // MongoDB 문서 고유 식별자
    
    private String opinion;    // 의견/댓글 내용
    private String date;       // 작성 날짜
    private String author;     // 작성자
}