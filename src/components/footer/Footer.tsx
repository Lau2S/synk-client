import React from "react";
import { Link } from "react-router";
import "./Footer.scss";

/**
 * Application footer with a quick link to the site map.
 *
 * @component
 * @returns {JSX.Element} Footer navigation for secondary routes.
 */
const Footer: React.FC = () => {
  return (
    <footer role="contentinfo" aria-label="Pie de página de Synk" className="app-footer">
      <Link to="/mapa-sitio" aria-label="Ir al mapa del sitio">
        Mapa del Sitio
      </Link>
      <span className="footer-separator" aria-hidden="true"> | </span>
      <a
        href="/manual-usuario-synk.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir manual de usuario en una nueva pestaña (PDF)"
      >
        Manual de Usuario
      </a>

      <p aria-hidden="false">©2025 Synk. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;