package com.stockmarket.repository;

import com.stockmarket.model.Discussion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Discussion 엔티티에 대한 데이터베이스 작업을 처리하는 리포지토리
 */
@Repository
public interface DiscussionRepository extends MongoRepository<Discussion, String> {
    // 작성자로 토론 목록 찾기
    List<Discussion> findByAuthor(String author);
    
    // 날짜로 토론 목록 찾기
    List<Discussion> findByDate(String date);
    
    // 작성자와 날짜로 토론 찾기
    Optional<Discussion> findByAuthorAndDate(String author, String date);
} 