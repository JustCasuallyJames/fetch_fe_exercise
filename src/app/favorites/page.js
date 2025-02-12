"use client"; // Ensure this page runs only on the client side

import dynamic from "next/dynamic";

// Import the actual component dynamically and disable SSR
const Favorites = dynamic(() => import("./pageContent"), { ssr: false });

export default function Page() {
  return <Favorites />;
}
