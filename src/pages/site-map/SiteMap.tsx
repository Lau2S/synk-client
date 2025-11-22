import React from "react";
import "./SiteMap.scss";
import { Link } from "react-router-dom";

/**
 * SiteMap page component.
 *
 * Renders a sitemap with grouped links for main navigation, user actions,
 * meetings and profile-related pages. Intended to help users and crawlers
 * discover available routes.
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} Sitemap page markup.
 */

const SiteMap: React.FC = () =>   {
    return (
        <div className="site-map-container">

            <div className="titles">
                <h1>Mapa del Sitio</h1>
                <p>Explora nuestro sitio web para encontrar fácilmente lo que buscas.</p>
            </div>

            <section className="site-map-content">
                <article className="site-map-box">
                    <h2>Navegacion Principal</h2>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/about-us">Sobre Nosotros</Link></li>
                        <li><Link to="/site-map">Mapa del Sitio</Link></li>
                    </ul>
                </article>

                <article className="site-map-box">
                    <h2>Usuario</h2>
                    <ul>
                        <li><Link to="/login">Inicia Sesión</Link></li>
                        <li><Link to="/register">Recuperar Contraseña</Link></li>
                        <li><Link to="/register">Registrate</Link></li>
                        <li><Link to="/register">Cerrar Sesión</Link></li>
                    </ul>
                </article>

                <article className="site-map-box">
                    <h2>Reuniones</h2>
                    <ul>
                        <li><Link to="/dashboard">Crear Reunión</Link></li>
                        <li><Link to="/dashboard">Unirse a Reunión</Link></li>
                    </ul>
                </article>

                <article className="site-map-box">
                    <h2>Perfil Usuario</h2>
                    <ul>
                        <li><Link to="/profile">Editar Perfil</Link></li>
                        <li><Link to="/profile">Cambiar Contraseña</Link></li>
                        <li><Link to="/profile">Eliminar Cuenta</Link></li>
                    </ul>
                </article>

            </section>
          
        </div>
    );
}

export default SiteMap;