import React from "react";
import { ThemeProvider, Container, Grid } from "@mui/material";
import theme from "../theme";
import CommentPage from "./commentpage"; // Placeholder component for discussion board
import ProfilePage from "./profilepage"; // Placeholder component for user profiles

const DiscussionPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container style={{ margin: "7vh" }}>
        <Grid container spacing={3}>
          {/* Left Section - Discussion Board */}
          <Grid item xs={9}>
            <CommentPage />
          </Grid>

          {/* Right Section - User Profiles */}
          <Grid item xs={3}>
            <ProfilePage />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default DiscussionPage;
