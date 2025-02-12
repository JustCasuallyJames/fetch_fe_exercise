"use client";
import dynamic from 'next/dynamic';

// Dynamically import Bootstrap (this is fine because it's CSS)
const BootstrapStyles = dynamic(() => import("bootstrap/dist/css/bootstrap.min.css"), { ssr: false });

// Dynamically import the Login component (this should be SSR-disabled)
const Login = dynamic(() => import("@/app/components/Login"), { ssr: false });

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <BootstrapStyles/>
      <Router>
        <Routes>
          {/* Set the login page as the default route */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}