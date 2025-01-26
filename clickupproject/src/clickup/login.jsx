import React, { useState, useReducer, useEffect } from "react";
import { ThemeProvider, Typography, Button, TextField, Dialog, Container, Box } from "@mui/material";
import theme from "../theme";
import { utils, writeFile } from "xlsx";
import MarketCharts from "./stockmarketcharts";

import "../App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import backgroundImage from '../assets/stock-background.jpg';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const initialState = {
    users: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const [msg, setMsg] = useState("Welcome");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const [openLoginModal, setOpenLoginModal] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      localStorage.removeItem("userEmail");
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
      setState({
        users: json.data.users,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              login(email: "${userEmail}", password: "${userPassword}") {
                id
                email
                password
                following {
                  account
                }
              }
            }
          `
        }),
      });

      const data = await response.json();
      if (data.data && data.data.login) {
        login(data.data.login);
        navigate('/marketcharts');
        console.log('Login successful, user data:', data.data.login);
      } else {
        console.log('Login failed:', data);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onButtonRegister = async () => {
    let isFound = state.users.some((user) => user.email === userEmail);
    if (isFound) {
      setMsg(`That email is taken. Try another.`);
    } else {
      try {
        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            query:
              "mutation($email: String, $password: String, $following: [FollowingInput]) {adduser(email: $email, password: $password, following: $following){email, password, following {account}}}",
            variables: {
              email: userEmail,
              password: userPassword,
              following: [],
            },
          }),
        });
        fetchUsers();
      } catch (error) {
        console.log(error);
      }
      setMsg(`Your are now registered.`);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      style={{ 
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/src/assets/stock-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
          {msg}
        </Typography>
        <TextField
          label="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          type="password"
          label="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Button
          variant="text"
          onClick={() => navigate("/register")}
          fullWidth
          sx={{ mt: 1 }}
        >
          Create New Account
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
