package com.stockmarket.controller;

import com.stockmarket.model.User;
import com.stockmarket.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

/**
 * 사용자 관련 GraphQL 요청을 처리하는 컨트롤러
 */
@Controller
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 모든 사용자 조회 쿼리
     */
    @QueryMapping(name = "users")
    public List<User> getUsers() {
        logger.info("Received users query");
        try {
            List<User> users = userService.findAllUsers();
            logger.info("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error in users query: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 새로운 사용자 등록 뮤테이션
     */
    @MutationMapping(name = "addUser")
    public User addUser(@Argument String email, @Argument String password) {
        logger.info("Received addUser mutation for email: {}", email);
        try {
            User user = userService.addUser(email, password);
            logger.info("Successfully added user with id: {}", user.getId());
            return user;
        } catch (Exception e) {
            logger.error("Error in addUser mutation: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 팔로잉 추가 뮤테이션
     */
    @MutationMapping
    public User addFollowing(@Argument String email, @Argument String account) {
        return userService.addFollowing(email, account);
    }

    /**
     * 로그인 뮤테이션
     */
    @MutationMapping
    public User login(@Argument String email, @Argument String password) {
        return userService.login(email, password);
    }

    /**
     * 팔로잉 제거 뮤테이션
     */
    @MutationMapping
    public User removeFollowing(@Argument String email, @Argument String account) {
        return userService.removeFollowing(email, account);
    }
} 