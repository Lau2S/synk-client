import React from "react";
import { NavLink, useNavigate } from "react-router";
import "./Navbar.scss";

/**
 * Global navigation bar providing primary links to key routes.
 *
 * @component
 * @returns {JSX.Element} A semantic navigation element with app links.
 * @accessibility
 * Uses semantic <nav> and <a> (via Link) for keyboard and screen reader navigation.
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="site-nav" role="navigation" aria-label="Navegación principal">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo-link" aria-label="Ir a la página principal" tabIndex={0}>
          <img src="/logo-synk.png" alt="Synk" className="nav-logo" />
        </NavLink>

        <ul className="nav-links" role="menubar" aria-label="Enlaces principales">
          <li role="none">
            <NavLink to="/" role="menuitem" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Inicio
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/about-us" role="menuitem" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Sobre Nosotros
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/site-map" role="menuitem" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Mapa del Sitio
            </NavLink>
          </li>
        </ul>

        <div className="auth-buttons" role="group" aria-label="Acciones de autenticación">
          <button
            className="btn-register"
            onClick={() => navigate("/register")}
            aria-label="Regístrate en Synk"
          >
            Regístrate
          </button>

          <button
            className="btn-login"
            onClick={() => navigate("/login")}
            aria-label="Inicia sesión en Synk"
            tabIndex={0}
          >
            Inicia Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;