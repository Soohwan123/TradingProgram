import React, { useState, useReducer, useEffect } from "react";
import { ThemeProvider, Typography, Button, TextField } from "@mui/material";
import theme from "../theme";
import { utils, writeFile } from "xlsx";
import MarketCharts from "./stockmarketcharts";

import "../App.css";
import { Routes, Route, useNavigate } from "react-router-dom";

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

  const onButtonLogin = async () => {
    let isFound = state.users.some(
      (user) => user.email === userEmail && user.password === userPassword
    );
    if (isFound) {
      setMsg(`Welcome ${userEmail}!`);
      localStorage.setItem("userEmail", userEmail);
      navigate("/marketcharts");
    } else {
      setMsg(`Couldn't find your Account. Try again.`);
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
    <ThemeProvider theme={theme}>
      <div
        style={{
          margin: "20vh",
          textAlign: "center",
          alignContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="h6" style={{ paddingBottom: "1vh" }}>
          {msg}
        </Typography>
        <Typography variant="h5">Login</Typography>
        <TextField
          label="Username"
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
          onClick={onButtonLogin}
          fullWidth
        >
          Login
        </Button>
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h5">Register</Typography>
          <TextField
            label="Username"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="Password"
            fullWidth
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onButtonRegister}
            fullWidth
          >
            Register
          </Button>
        </div>
      </div>
      <Routes>
        <Route path="/marketcharts" element={<MarketCharts />} />
      </Routes>
    </ThemeProvider>
  );
};

export default Login;
