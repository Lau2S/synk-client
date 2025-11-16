import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

/**
 * Root layout component that wraps all pages with the Navbar and Footer.
 * This ensures the Navbar and Footer appear on every route by default.
 */
const RootLayout: React.FC = () => {
  const location = useLocation();

  // Rutas en las que no queremos mostrar el Navbar
  const hiddenNavbarPrefixes = ["/dashboard", "/profile", "/profile"];
  const hideNavbar = hiddenNavbarPrefixes.some((p) =>
    location.pathname.startsWith(p)
  );
  return (
    <div className="root-layout">
      {!hideNavbar && <Navbar />}
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
