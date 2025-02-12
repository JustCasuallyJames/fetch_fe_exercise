"use client";
import dynamic from 'next/dynamic';

// Dynamically import Bootstrap (this is fine because it's CSS)
import("bootstrap/dist/css/bootstrap.min.css")

// Dynamically import the Login component (this should be SSR-disabled)
const Login = dynamic(() => import("@/app/components/Login"), { ssr: false });

import React from 'react';

export default function Home() {
  return (
    <>
      {/* <BootstrapStyles/> */}
      <Login/>
    </>
  );
}