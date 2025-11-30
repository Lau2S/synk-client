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
        <main id="site-map-main" role="main" aria-labelledby="site-map-title">
            <div className="site-map-container" role="region" aria-label="Mapa del sitio">
                <div className="titles">
                    <h1 id="site-map-title">Mapa del Sitio</h1>
                    <p id="site-map-desc">Explora nuestro sitio web para encontrar fácilmente lo que buscas.</p>
                </div>

                <section className="site-map-content" role="region" aria-labelledby="site-map-title" aria-describedby="site-map-desc">
                    <article className="site-map-box navigation" role="region" aria-labelledby="nav-heading">
                        <div className="box-header">
                            <div className="box-icon" aria-hidden="true">🏠</div>
                            <h2 id="nav-heading">Navegación Principal</h2>
                        </div>
                        <ul role="list" aria-label="Enlaces de navegación principal">
                            <li role="listitem">
                                <Link to="/"><span aria-hidden="true">📍</span> Inicio</Link>
                            </li>
                            <li role="listitem">
                                <Link to="/about-us"><span aria-hidden="true">👥</span> Sobre Nosotros</Link>
                            </li>
                            <li role="listitem">
                                <Link to="/site-map"><span aria-hidden="true">🗺️</span> Mapa del Sitio</Link>
                            </li>
                        </ul>
                    </article>

                    <article className="site-map-box user" role="region" aria-labelledby="user-heading">
                        <div className="box-header">
                            <div className="box-icon" aria-hidden="true">👤</div>
                            <h2 id="user-heading">Usuario</h2>
                        </div>
                        <ul role="list" aria-label="Enlaces de usuario">
                            <li role="listitem"><Link to="/login"><span aria-hidden="true">🔐</span> Inicia Sesión</Link></li>
                            <li role="listitem"><Link to="/reset-password"><span aria-hidden="true">🔑</span> Recuperar Contraseña</Link></li>
                            <li role="listitem"><Link to="/register"><span aria-hidden="true">📝</span> Registrate</Link></li>
                            <li role="listitem"><Link to="/logout"><span aria-hidden="true">🚪</span> Cerrar Sesión</Link></li>
                        </ul>
                    </article>

                    <article className="site-map-box meetings" role="region" aria-labelledby="meetings-heading">
                        <div className="box-header">
                            <div className="box-icon" aria-hidden="true">📹</div>
                            <h2 id="meetings-heading">Reuniones</h2>
                        </div>
                        <ul role="list" aria-label="Enlaces de reuniones">
                            <li role="listitem"><Link to="/meeting"><span aria-hidden="true">🎥</span> Nueva Reunión</Link></li>
                            <li role="listitem"><Link to="/dashboard"><span aria-hidden="true">⚡</span> Unirse a Reunión</Link></li>
                            <li role="listitem"><Link to="/dashboard"><span aria-hidden="true">📊</span> Historial</Link></li>
                        </ul>
                    </article>

                    <article className="site-map-box profile" role="region" aria-labelledby="profile-heading">
                        <div className="box-header">
                            <div className="box-icon" aria-hidden="true">⚙️</div>
                            <h2 id="profile-heading">Perfil Usuario</h2>
                        </div>
                        <ul role="list" aria-label="Enlaces de perfil">
                            <li role="listitem"><Link to="/profile"><span aria-hidden="true">✏️</span> Editar Perfil</Link></li>
                            <li role="listitem"><Link to="/profile"><span aria-hidden="true">🔒</span> Cambiar Contraseña</Link></li>
                            <li role="listitem"><Link to="/profile"><span aria-hidden="true">❌</span> Eliminar Cuenta</Link></li>
                        </ul>
                    </article>
                </section>
            </div>
        </main>
    );
}

export default SiteMap;