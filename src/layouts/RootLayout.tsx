import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import NavbarDashboard from "../components/navbar/NavbarDashboard";
import Footer from "../components/footer/Footer";

/**
 * Root layout component that wraps all pages with the Navbar and Footer.
 * This ensures the Navbar and Footer appear on every route by default.
 */
const RootLayout: React.FC = () => {
  const location = useLocation();

  // Selección condicional del Navbar según la ruta
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isProfile = location.pathname.startsWith("/profile");
  const useAuthNavbar = isDashboard || isProfile;

  return (
    <div className="root-layout">
      {useAuthNavbar ? <NavbarDashboard /> : <Navbar />}

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
