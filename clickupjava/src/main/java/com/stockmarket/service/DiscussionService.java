package com.stockmarket.service;

import com.stockmarket.model.Discussion;
import com.stockmarket.repository.DiscussionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 토론 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class DiscussionService {
    private final DiscussionRepository discussionRepository;

    @Autowired
    public DiscussionService(DiscussionRepository discussionRepository) {
        this.discussionRepository = discussionRepository;
    }

    /**
     * 새로운 토론 추가
     */
    public Discussion addDiscussion(String opinion, String date, String author) {
        Discussion discussion = new Discussion();
        discussion.setOpinion(opinion);
        discussion.setDate(date);
        discussion.setAuthor(author);
        return discussionRepository.save(discussion);
    }

    /**
     * 모든 토론 조회
     */
    public List<Discussion> findAllDiscussions() {
        return discussionRepository.findAll();
    }

    /**
     * 작성자별 토론 조회
     */
    public List<Discussion> findDiscussionsByAuthor(String author) {
        return discussionRepository.findByAuthor(author);
    }

    public Discussion deleteDiscussion(String id) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Discussion not found"));
        discussionRepository.deleteById(id);
        return discussion;
    }
} 