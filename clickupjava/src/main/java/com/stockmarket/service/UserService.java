package com.stockmarket.service;

import com.stockmarket.model.User;
import com.stockmarket.model.Following;
import com.stockmarket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

/**
 * 사용자 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        logger.info("UserService initialized with repository: {}", userRepository);
    }

    /**
     * 모든 사용자 조회
     */
    public List<User> findAllUsers() {
        try {
            logger.info("Fetching all users");
            return userRepository.findAll();
        } catch (Exception e) {
            logger.error("Error fetching users: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 새로운 사용자 등록
     */
    public User addUser(String email, String password) {
        try {
            logger.debug("Starting addUser method with email: {}", email);
            
            // 이메일 중복 체크
            boolean exists = userRepository.existsByEmail(email);
            logger.debug("Email exists check result: {}", exists);
            
            if (exists) {
                logger.warn("Email already exists: {}", email);
                throw new RuntimeException("Email already exists");
            }

            // 새 사용자 객체 생성
            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            logger.debug("Created new User object: {}", user);

            // 저장 시도
            User savedUser = userRepository.save(user);
            logger.info("Successfully saved user: {}", savedUser);
            
            return savedUser;
            
        } catch (Exception e) {
            logger.error("Error in addUser: ", e);
            throw new RuntimeException("Failed to add user: " + e.getMessage());
        }
    }

    /**
     * 로그인 처리
     */
    public User login(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    /**
     * 팔로잉 추가
     */
    public User addFollowing(String email, String accountToFollow) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Following following = new Following();
        following.setAccount(accountToFollow);
        
        if (user.getFollowing() == null) {
            user.setFollowing(new ArrayList<>());
        }
        user.getFollowing().add(following);
        
        return userRepository.save(user);
    }

    /**
     * 팔로잉 제거
     */
    public User removeFollowing(String email, String account) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getFollowing().removeIf(following -> following.getAccount().equals(account));
        return userRepository.save(user);
    }

    // toString 메서드 추가
    @Override
    public String toString() {
        return "UserService{" +
                "userRepository=" + userRepository +
                '}';
    }
} 