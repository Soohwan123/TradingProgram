import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();  // AuthContext의 logout 함수 호출
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth={false}>  {/* maxWidth={false}로 변경하여 전체 너비 사용 */}
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 0, 
              display: { xs: 'none', md: 'flex' }, 
              mr: 4,
              whiteSpace: 'nowrap'
            }}
          >
            ViewChart
          </Typography>

          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            gap: 2,
            justifyContent: 'center'  // 중앙 정렬
          }}>
            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<ShowChartIcon />}
                  component={Link}
                  to="/marketcharts"
                >
                  S&P 500
                </Button>
                
                <Button
                  color="inherit"
                  startIcon={<CurrencyBitcoinIcon />}
                  component={Link}
                  to="/crypto"
                >
                  Bitcoin
                </Button>

                <Button
                  color="inherit"
                  startIcon={<MonetizationOnIcon />}
                  component={Link}
                  to="/gold"
                >
                  Gold Market
                </Button>

                <Button
                  color="inherit"
                  startIcon={<ForumIcon />}
                  component={Link}
                  to="/discussions"
                >
                  Discussion
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ 
            flexGrow: 0,
            display: 'flex',
            gap: 1  // 버튼 사이 간격
          }}>
            {user && (
              <Button
                color="inherit"
                onClick={handleLogout}  // handleLogout 함수 사용
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar; 