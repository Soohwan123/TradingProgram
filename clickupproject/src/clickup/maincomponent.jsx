// App.js
import React, { useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import Login from "./login";
import BitcoinMarketCharts from "./bitcoinmarketcharts";
import DiscussionBoard from "./discussionboard";
import StockMarketCharts from "./stockmarketcharts";

const MainComponent = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onButtonEmail = () => {
    // Open the logout confirmation dialog
    setOpenLogoutDialog(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
    // Close the logout confirmation dialog
    setOpenLogoutDialog(false);
  };
  const styles = {
    toolbar: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    typography: {
      marginRight: "5rem",
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar style={styles.toolbar}>
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            color="inherit"
            textAlign={"left"}
            style={{ fontSize: 27 }}
          >
            New Kimchi Finance
          </Typography>

          <div className="menu-items">
            <MenuItem
              style={{ fontWeight: "bold" }}
              component={NavLink}
              to="/stockmarketcharts"
            >
              S&P500 Index Chart
            </MenuItem>
            <MenuItem
              style={{ fontWeight: "bold" }}
              component={NavLink}
              to="/bitcoinmarketcharts"
            >
              Bitcoin Market Charts
            </MenuItem>
            <MenuItem
              style={{ fontWeight: "bold" }}
              component={NavLink}
              to="/discussionboard"
            >
              Discussion Board
            </MenuItem>
          </div>

          <Typography
            variant="subtitle1"
            color="inherit"
            style={{ marginLeft: "auto", marginRight: 10 }}
            onClick={onButtonEmail}
          >
            {localStorage.getItem("userEmail") || "Guest Mode"}
          </Typography>
          <IconButton id="menubtn" onClick={handleClick} color="inherit">
            <MenuIcon />
          </IconButton>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={NavLink}
              to="/stockmarketcharts"
              onClick={handleClose}
            >
              Stock Market Charts
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/materialmarketcharts"
              onClick={handleClose}
            >
              Material Market Charts
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/discussionboard"
              onClick={handleClose}
            >
              Discussion Board
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stockmarketcharts" element={<StockMarketCharts />} />
        <Route
          path="/bitcoinMarketCharts"
          element={<BitcoinMarketCharts />}
        />
        <Route path="/discussionboard" element={<DiscussionBoard />} />
      </Routes>
    </ThemeProvider>
  );
};
export default MainComponent;

/* import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Typography,
} from "@mui/material";
import theme from "../theme";
const loginCompo = () => {
  return (
    <ThemeProvider theme={theme}>
      <Card style={{ width: "90wv" }}>
        <Typography>Hello</Typography>
      </Card>
    </ThemeProvider>
  );
};
export default HomeCompo;
 */
