// discussionboard.js
import React, { useState, useEffect, useReducer } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import format from "date-fns/format";

const CommentPage = () => {
  const initialState = {
    comments: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "query{ discussions { opinion, date, author}}",
        }),
      });
      let json = await response.json();
      setState({
        comments: json.data.discussions,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onButtonSubmit = async () => {
    try {
      // Get the current date and time
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString(); // You can format the date according to your requirements

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "mutation($opinion: String, $date: String, $author: String) {adddiscussion (opinion: $opinion, date: $date, author: $author){opinion, date, author}}",
          variables: {
            opinion: newComment,
            date: formattedDate,
            author: localStorage.getItem("userEmail") || "Guest",
          },
        }),
      });
      fetchComments();
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{}}>
      <Card>
        <CardContent>
          <List>
            {state.comments.map((comment) => (
              <div key={comment.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{comment.opinion}</Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" align="right">
                          {format(
                            new Date(comment.date),
                            "yyyy-MM-dd hh:mm:ss a"
                          )}
                        </Typography>
                        <Typography variant="caption" align="right">
                          {`\t${comment.author || "Guest"}`}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </CardContent>
      </Card>

      <div style={{ marginTop: "20px" }}>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={onButtonSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CommentPage;
