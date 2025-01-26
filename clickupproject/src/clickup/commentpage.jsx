// discussionboard.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';  // 현재 로그인한 사용자 정보를 가져오기 위해

const CommentPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // 디버깅을 위한 콘솔 로그
    console.log('Current user:', user);
  }, [user]);

  // 모든 토론 내용을 가져오는 함수
  const fetchDiscussions = async () => {
    try {
      const response = await fetch('http://localhost:5000/graphql', {  // 8080에서 5000으로 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              discussions {
                id
                opinion
                date
                author
              }
            }
          `
        }),
      });

      const data = await response.json();
      if (data.data) {
        setDiscussions(data.data.discussions);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  // 컴포넌트 마운트 시 토론 내용 가져오기
  useEffect(() => {
    fetchDiscussions();
    // 5초마다 새로운 댓글 확인
    const intervalId = setInterval(fetchDiscussions, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // 새 댓글 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await fetch('http://localhost:5000/graphql', {  // URL 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              addDiscussion(
                opinion: "${newComment}"
                date: "${new Date().toISOString()}"
                author: "${user.email}"
              ) {
                id
                opinion
                date
                author
              }
            }
          `
        }),
      });

      const data = await response.json();
      if (data.data) {
        setNewComment('');
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Error adding discussion:', error);
    }
  };

  // 댓글 삭제 함수
  const handleDelete = async (discussionId, author) => {
    // 현재 로그인한 사용자가 작성자인지 확인
    if (!user || user.email !== author) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              deleteDiscussion(id: "${discussionId}") {
                id
              }
            }
          `
        }),
      });

      const data = await response.json();
      if (data.data) {
        // 삭제 성공 시 목록 새로고침
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom color="primary">
        Discussion Board
      </Typography>
      
      {/* 댓글 목록 */}
      <List sx={{ 
        flex: 1, 
        overflow: 'auto', 
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}>
        {discussions.map((discussion) => (
          <React.Fragment key={discussion.id}>
            <ListItem 
              alignItems="flex-start"
              secondaryAction={
                user && user.email === discussion.author && (
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDelete(discussion.id, discussion.author)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="subtitle2"
                    color="primary"
                  >
                    {discussion.author}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {discussion.opinion}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {new Date(discussion.date).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      {/* 댓글 입력 폼 */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 'auto' }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          variant="outlined"
          sx={{ mb: 1 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!user || !newComment.trim()}
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CommentPage;
