"use client";
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "@/app/components/Login.js";

export default function Home() {
  return (
    <Router>
      <Routes>
        {/* Set the login page as the default route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}
