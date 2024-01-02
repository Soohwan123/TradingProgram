
import axios from 'axios';
import { ThemeProvider, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
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

const BitcoinMarketCharts = () => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(
          'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=2000&toTs=-1&api_key=05bde4f591713196c1ddb739ed58ce648b1be4869278e315286711285e80ad1b'
        );
        console.log(response.data.Data.Data);
        setHistoricalData(response.data.Data.Data || []); 
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    // Fetch data initially
    fetchHistoricalData();
  
    // Set interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchHistoricalData();
    }, 10000);
  
    // Clean up interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once after initial render

  // Extracting time and price data for the chart
  const chartData = {
    labels: historicalData.map((dataPoint) => new Date(dataPoint.time * 1000).toLocaleString()),
    datasets: [
      {
        label: 'Price',
        data: historicalData.map((dataPoint) => dataPoint.high),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ margin: '7vh' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Bitcoin Price Chart</Typography>
            <Line data={chartData} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default BitcoinMarketCharts;
