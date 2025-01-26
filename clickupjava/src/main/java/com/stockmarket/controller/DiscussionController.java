package com.stockmarket.controller;

import com.stockmarket.model.Discussion;
import com.stockmarket.service.DiscussionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

/**
 * 토론 관련 GraphQL 요청을 처리하는 컨트롤러
 */
@Controller
public class DiscussionController {
    private final DiscussionService discussionService;

    @Autowired
    public DiscussionController(DiscussionService discussionService) {
        this.discussionService = discussionService;
    }

    /**
     * 모든 토론 조회 쿼리
     */
    @QueryMapping
    public List<Discussion> discussions() {
        return discussionService.findAllDiscussions();
    }

    /**
     * 새로운 토론 추가 뮤테이션
     */
    @MutationMapping
    public Discussion addDiscussion(
        @Argument String opinion,
        @Argument String date,
        @Argument String author
    ) {
        return discussionService.addDiscussion(opinion, date, author);
    }

    /**
     * 작성자별 토론 조회 쿼리
     */
    @QueryMapping
    public List<Discussion> discussionsByAuthor(@Argument String author) {
        return discussionService.findDiscussionsByAuthor(author);
    }

    /**
     * 토론 삭제 뮤테이션
     */
    @MutationMapping
    public Discussion deleteDiscussion(@Argument String id) {
        return discussionService.deleteDiscussion(id);
    }
} 