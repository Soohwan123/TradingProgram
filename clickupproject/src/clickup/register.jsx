import React, { useState } from "react";
import { ThemeProvider, Typography, Button, TextField, Box, Dialog, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import backgroundImage from '../assets/stock-background.jpg';

const Register = ({ setMsg }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const [openRegisterModal, setOpenRegisterModal] = useState(true);

  const onButtonRegister = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `
            mutation {
              addUser(email: "${userEmail}", password: "${userPassword}") {
                id
                email
              }
            }
          `
        }),
      });
      
      const result = await response.json();
      if (result.data && result.data.addUser) {
        setMsg(`You are now registered.`);
        navigate("/");
      } else {
        setMsg(`Registration failed. Please try again.`);
      }
    } catch (error) {
      console.log(error);
      setMsg(`Error during registration.`);
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
          Create Account
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
          onClick={onButtonRegister}
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
        <Button
          variant="text"
          onClick={() => navigate("/")}
          fullWidth
          sx={{ mt: 1 }}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Register;