import React from "react";
import { ThemeProvider, Container, Grid } from "@mui/material";
import theme from "../theme";
import CommentPage from "./commentpage"; // Placeholder component for discussion board
import ProfilePage from "./profilepage"; // Placeholder component for user profiles

const DiscussionPage = () => {
  return (
    <ThemeProvider theme={theme}>
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
        <Grid 
          container 
          spacing={3} 
          style={{
            width: '90%',
            height: '90%',
            padding: '20px',
          }}
        >
          {/* Left Section - Discussion Board */}
          <Grid item xs={9}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '20px',
              height: '100%'
            }}>
              <CommentPage />
            </div>
          </Grid>

          {/* Right Section - User Profiles */}
          <Grid item xs={3}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '20px',
              height: '100%'
            }}>
              <ProfilePage />
            </div>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default DiscussionPage;
