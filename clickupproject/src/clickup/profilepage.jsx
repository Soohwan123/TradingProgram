// userprofile.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import { PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchUsers = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                email
              }
              currentUser: user(email: "${user.email}") {
                following {
                  account
                }
              }
            }
          `
        }),
      });
      
      const data = await response.json();
      
      if (data.data) {
        const followingList = data.data.currentUser?.following?.map(f => f.account) || [];
        setFollowing(followingList);
        
        const otherUsers = data.data.users.filter(u => u.email !== user.email);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error fetching users and following:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleFollow = async (accountToFollow) => {
    try {
      setFollowing(prev => [...prev, accountToFollow]);

      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation {
              addFollowing(email: "${user.email}", account: "${accountToFollow}") {
                id
                email
                following {
                  account
                }
              }
            }
          `
        }),
      });
      const data = await response.json();
      if (data.data) {
        const updatedFollowing = data.data.addFollowing.following.map(f => f.account);
        setFollowing(updatedFollowing);
      }
    } catch (error) {
      console.error('Error following user:', error);
      setFollowing(prev => prev.filter(email => email !== accountToFollow));
    }
  };

  const handleUnfollow = async (accountToUnfollow) => {
    try {
      setFollowing(prev => prev.filter(email => email !== accountToUnfollow));

      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation {
              removeFollowing(email: "${user.email}", account: "${accountToUnfollow}") {
                id
                email
                following {
                  account
                }
              }
            }
          `
        }),
      });
      const data = await response.json();
      if (data.data) {
        const updatedFollowing = data.data.removeFollowing.following.map(f => f.account);
        setFollowing(updatedFollowing);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setFollowing(prev => [...prev, accountToUnfollow]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ width: 60, height: 60, bgcolor: '#000000' }}>
          {user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" color="primary">
          {user?.email || 'Not logged in'}
        </Typography>
      </Box>

      <List sx={{ width: '100%' }}>
        {users.map((otherUser) => {
          const isFollowing = following.includes(otherUser.email);
          
          return (
            <ListItem
              key={otherUser.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {isFollowing ? (
                <IconButton 
                  onClick={() => handleUnfollow(otherUser.email)}
                  sx={{ 
                    color: 'white',
                    bgcolor: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                    width: 35,
                    height: 35,
                    borderRadius: '50%',
                    minWidth: 35,
                    ml: -4
                  }}
                >
                  <PersonRemoveIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton 
                  onClick={() => handleFollow(otherUser.email)}
                  sx={{ 
                    color: 'primary.main',
                    width: 35,
                    height: 35,
                    ml: -4
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              )}

              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#000000' }}>
                  {otherUser.email.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={otherUser.email}
                secondary={isFollowing ? 'Following' : ''}
                sx={{ 
                  ml: -2,
                  '& .MuiListItemText-primary': {
                    color: isFollowing ? 'success.main' : 'inherit'
                  },
                  '& .MuiListItemText-secondary': {
                    color: isFollowing ? 'success.light' : 'text.secondary'
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          계정 정보
        </Typography>
        <Typography variant="body2">
          이메일: {user?.email}
        </Typography>
        <Typography variant="body2">
          가입일: {user?.id ? new Date(parseInt(user.id.substring(0, 8), 16) * 1000).toLocaleDateString() : 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;
