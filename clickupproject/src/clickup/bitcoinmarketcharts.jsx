import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';
import { ThemeProvider, Container, Grid, Typography, CircularProgress, Box, TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import theme from '../theme';
import axios from 'axios';

const BitcoinMarketCharts = () => {
  const chartContainerRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [priceLines, setPriceLines] = useState([]);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(
          'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=2000&toTs=-1&api_key=05bde4f591713196c1ddb739ed58ce648b1be4869278e315286711285e80ad1b'
        );
        
        const formattedData = response.data.Data.Data.map(d => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volumeto
        }));

        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setError('Failed to load chart data');
        setLoading(false);
      }
    };

    fetchHistoricalData();
    const intervalId = setInterval(fetchHistoricalData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const addTargetPrice = () => {
    if (!targetPrice || !candlestickSeriesRef.current) return;

    const price = parseFloat(targetPrice);
    if (isNaN(price)) {
      toast.error('유효한 가격을 입력해주세요');
      return;
    }

    const currentPrice = chartData[chartData.length - 1].close;
    if (price <= currentPrice) {
      toast.error('목표가는 현재가보다 높아야 합니다');
      return;
    }

    const priceLine = {
      price: price,
      color: '#1a237e',
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: `목표가 $${price.toLocaleString()}`,
    };

    candlestickSeriesRef.current.createPriceLine(priceLine);
    setPriceLines([...priceLines, priceLine]);
    setTargetPrice('');
    toast.success(`목표가 $${price.toLocaleString()} 설정 완료`);
  };

  useEffect(() => {
    if (!chartData || !priceLines.length) return;

    const currentPrice = chartData[chartData.length - 1].close;
    priceLines.forEach(line => {
      if ((line.price > chartData[chartData.length - 2]?.close && line.price <= currentPrice) ||
          (line.price < chartData[chartData.length - 2]?.close && line.price >= currentPrice)) {
        toast.info(`목표가 $${line.price.toLocaleString()} 도달!`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });
  }, [chartData, priceLines]);

  useEffect(() => {
    if (!chartData || !chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#000000' },
        textColor: '#333',
        padding: { left: 10, right: 10, top: 10, bottom: 10 }
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 'normal',
      },
      rightPriceScale: {
        borderColor: '#f0f0f0',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#f0f0f0',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 15,
      },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current.setData(chartData);

    priceLines.forEach(line => {
      candlestickSeriesRef.current.createPriceLine(line);
    });

    const handleResize = () => {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current.remove();
    };
  }, [chartData]);

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
        <Grid container spacing={0} style={{ 
          width: '90%', 
          height: '90%',
          backgroundColor: 'transparent',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom style={{ 
              margin: '10px', 
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              Bitcoin Price Chart
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 2, 
              alignItems: 'center',
              '& .MuiTextField-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px'
              }
            }}>
              <TextField
                label="목표가 설정"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                type="number"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1a237e',
                  },
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                onClick={addTargetPrice}
              >
                목표가 추가
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
              <div
                ref={chartContainerRef} 
                style={{
                  width: '100%',
                  height: '70vh',
                  position: 'relative',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              />
            )}
          </Grid>
        </Grid>
      </Container>
      <ToastContainer position="top-right" />
    </ThemeProvider>
  );
};

export default BitcoinMarketCharts;
