import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './clickup/login';
import Register from './clickup/register';
import StockMarketCharts from './clickup/stockmarketcharts';
import DiscussionPage from './clickup/discussionboard';
import NavBar from './components/NavBar';
import { Box } from '@mui/material';
import BitcoinMarketCharts from './clickup/bitcoinmarketcharts';
import { AuthProvider } from './context/AuthContext';
import GoldMarketCharts from './clickup/goldmarketcharts';

function App() {
  const [msg, setMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태에 따라 다른 레이아웃 보여주기
  const AuthenticatedLayout = ({ children }) => (
    <Box>
      <NavBar />
      {children}
    </Box>
  );

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login setMsg={setMsg} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setMsg={setMsg} />} />

        {/* Protected routes */}
        <Route path="/marketcharts" element={
          <AuthenticatedLayout>
            <StockMarketCharts />
          </AuthenticatedLayout>
        } />
        <Route path="/crypto" element={
          <AuthenticatedLayout>
            <BitcoinMarketCharts />
          </AuthenticatedLayout>
        } />
        <Route path="/discussions" element={
          <AuthenticatedLayout>
            <DiscussionPage />
          </AuthenticatedLayout>
        } />
        <Route path="/profile" element={
          <AuthenticatedLayout>
            <DiscussionPage />
          </AuthenticatedLayout>
        } />
        <Route path="/gold" element={
          <AuthenticatedLayout>
            <GoldMarketCharts />
          </AuthenticatedLayout>
        } />
  
      </Routes>
    </AuthProvider>
  );
}

export default App;

/* import React from "react";
import { utils, writeFile } from "xlsx";

function App() {
  const generateExcelFile = () => {
    // Create a new workbook
    const workbook = utils.book_new();

    // Create a new worksheet
    const worksheet = utils.json_to_sheet([
      { Name: "John Doe", Age: 32, Gender: "Male" },
      { Name: "Jane Smith", Age: 28, Gender: "Female" },
      { Name: "Bob Johnson", Age: 45, Gender: "Male" },
    ]);

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a file
    writeFile(workbook, "example.xlsx");
  };

  return (
    <div>
      <button onClick={generateExcelFile}>Download Excel File</button>
    </div>
  );
}

export default App; */
