package com.stockmarket.repository;

import com.stockmarket.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * User 엔티티에 대한 데이터베이스 작업을 처리하는 리포지토리
 * MongoRepository를 상속받아 기본적인 CRUD 작업 메서드를 제공받음
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 이메일로 사용자 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 이메일과 비밀번호로 사용자 찾기 (로그인용)
    Optional<User> findByEmailAndPassword(String email, String password);
} 