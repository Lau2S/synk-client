import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

/**
 * Root layout component that wraps all pages with the Navbar and Footer.
 * This ensures the Navbar and Footer appear on every route by default.
 */
const RootLayout: React.FC = () => {
  return (
    <div className="root-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
