// userprofile.js
import React, { useState, useEffect, useReducer } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const ProfilePage = () => {
  const initialState = {
    following: [],
    unfollowing: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "query{ users { email, password, following {account}}}",
        }),
      });
      let json = await response.json();
      const currentUser = json.data.users.find(
        (user) => user.email === localStorage.getItem("userEmail")
      );
      const tempFollowing = [];
      const tempUnfollowing = [];
      json.data.users.forEach((user) => {
        const isFollowing = currentUser.following.some(
          (followedUser) => followedUser.account === user.email
        );

        if (isFollowing) {
          tempFollowing.push(user.email);
        } else {
          tempUnfollowing.push(user.email);
        }
        setState({ following: tempFollowing, unfollowing: tempUnfollowing });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onButtonFollow = async (account) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "mutation($email: String, $account: String) {addfollowing(email: $email, account: $account)}",
          variables: {
            email: localStorage.getItem("userEmail"),
            account: account,
          },
        }),
      });
      fetchStates();
    } catch (error) {
      console.log(error);
    }
  };
  const onButtonUnfollow = async (account) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "query($email: String, $account: String) {deletefollowing(email: $email, account: $account)}",
          variables: {
            email: localStorage.getItem("userEmail"),
            account: account,
          },
        }),
      });
      fetchStates();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: "20vh" }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Profile</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {localStorage.getItem("userEmail")}
          </Typography>
          <Divider style={{ margin: "15px 0" }} />
          <List>
            {state.following.map((item) => (
              <div key={item.id}>
                <ListItem>
                  <ListItemText
                    secondary={
                      <Typography variant="caption">{item}</Typography>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onButtonUnfollow(item)}
                  >
                    Unfollow
                  </Button>
                </ListItem>
              </div>
            ))}
          </List>
          <Divider style={{ margin: "15px 0" }} />
          <List>
            {state.unfollowing.map((item) => (
              <div key={item.id}>
                <ListItem>
                  <ListItemText
                    secondary={
                      <Typography variant="caption">{item}</Typography>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onButtonFollow(item)}
                  >
                    Follow
                  </Button>
                </ListItem>
              </div>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
