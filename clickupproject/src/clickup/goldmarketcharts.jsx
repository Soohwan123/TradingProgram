import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';
import { Container, Grid, Typography, CircularProgress, Box, TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import stockBackground from '../assets/stock-background.jpg';

const GoldMarketCharts = () => {
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
          'https://min-api.cryptocompare.com/data/v2/histohour?fsym=GOLD&tsym=USD&limit=2000&toTs=-1&api_key=05bde4f591713196c1ddb739ed58ce648b1be4869278e315286711285e80ad1b'
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
      color: '#2962FF',
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
        background: { color: '#ffffff' },
        textColor: '#333',
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
      },
      timeScale: {
        borderColor: '#f0f0f0',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 10,  // 캔들 간격 조정
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
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundImage: `url(${stockBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden'
    }}>
      <Container maxWidth={false} sx={{ pt: 10, height: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Gold Market Chart
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="목표가 설정"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                type="number"
                size="small"
                sx={{ 
                  bgcolor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2962FF',
                    },
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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
              <Box sx={{ 
                height: '60vh', 
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                boxShadow: 3
              }}>
                <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default GoldMarketCharts;