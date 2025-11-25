import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import NavbarDashboard from "../components/navbar/NavbarDashboard";
import Footer from "../components/footer/Footer";

/**
 * RootLayout component — application layout wrapper.
 *
 * Renders a navbar (public or authenticated variant), the current route's
 * outlet and a footer. The component uses the current location to decide
 * which navbar to render:
 * - NavbarDashboard is used for routes that start with /dashboard or /profile.
 * - Navbar (public) is used for all other routes.
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} The layout containing the selected navbar, Outlet and Footer.
 */

const RootLayout: React.FC = () => {
  const location = useLocation();

  // Determine if the current route belongs to the authenticated dashboard/profile area.
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isProfile = location.pathname.startsWith("/profile");
  const useAuthNavbar = isDashboard || isProfile;

  const hideNavbar = location.pathname.startsWith("/meeting");

  return (
    <div className="root-layout">
      {!hideNavbar && (useAuthNavbar ? <NavbarDashboard /> : <Navbar />)}

      <main className="main-content">
        <Outlet />
      </main>

      {!hideNavbar && <Footer />}
    </div>
  );
};

export default RootLayout;
