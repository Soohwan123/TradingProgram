
import axios from 'axios';
import { ThemeProvider, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Typography
} from "@mui/material";
import theme from "../theme";
import "../App.css";
const StockMarketCharts = () => {
  const [timestampData, setTimestampData] = useState([]);
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            query: "query{ snps {   timestamp,indicators  }}",
          }),
        });


        let json = await response.json();
        console.log(json.data.snps);
        setTimestampData(json.data.snps.timestamp);
        setPriceData(json.data.snps.indicators)
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
    labels: timestampData.map((dataPoint) => new Date(dataPoint * 1000).toLocaleString()),
    datasets: [
      {
        label: 'Price',
        data: priceData.map((dataPoint) => dataPoint),
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
            <Typography variant="h5">S&P500 Index Chart</Typography>
            <Line data={chartData} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
export default StockMarketCharts;
