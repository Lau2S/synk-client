import React from "react";
import './AboutUs.scss';
import { useNavigate } from "react-router-dom";

/**
 * AboutUs page component.
 *
 * Displays information about the project and the team, and exposes a button
 * that navigates the user to the login page.
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} The About Us page markup.
 */

const AboutUs: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Navigate to the login route.
     *
     * @returns {void}
     */

    return (
        <main id="main-about" className='container-about-us' role="main" aria-labelledby="about-title">
            <div className="main-container" role="region" aria-describedby="about-desc">
                <h1 id="about-title">Sobre Nosotros</h1>

                <p id="about-desc">
                    Somos un grupo de desarrolladores, diseñadores y entusiastas de la tecnología comprometidos con mejorar
                    la forma en que las personas colaboran a distancia. Nuestro trabajo combina innovación, diseño intuitivo y
                    tecnología de vanguardia para ofrecer una experiencia de reunión estable, fluida y accesible desde cualquier dispositivo.
                </p>

                <p>
                    Nuestro objetivo es seguir evolucionando, escuchando a nuestros usuarios y mejorando cada día, para que trabajar,
                    estudiar o reunirse en línea sea tan natural como estar cara a cara.
                </p>

                <div className="actions-row">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-access"
                        aria-label="Acceder a tu cuenta — ir a la página de inicio de sesión"
                    >
                        Acceder
                    </button>
                </div>
            </div>

            <section
                className="team-section"
                aria-labelledby="team-title"
                aria-describedby="team-desc"
                role="region"
            >
                <h2 id="team-title">Nuestro Equipo</h2>
                

                <div className="team-grid" role="list" aria-label="Miembros del equipo">
                    {/* Member 1 */}
                    <article
                        role="listitem"
                        className="team-member"
                        tabIndex={0}
                        aria-labelledby="member-vs-name"
                        aria-describedby="member-vs-role"
                    >
                        <div className="member-avatar" aria-hidden="true">
                            <span className="avatar-text">VS</span>
                            <div className="member-role-badge frontend" aria-hidden="true">Frontend</div>
                        </div>
                        <div className="member-info">
                            <h3 id="member-vs-name">Valentina Sanchez</h3>
                            <p id="member-vs-role">Front Developer</p>
                        </div>
                    </article>

                    {/* Member 2 */}
                    <article
                        role="listitem"
                        className="team-member"
                        tabIndex={0}
                        aria-labelledby="member-jb-name"
                        aria-describedby="member-jb-role"
                    >
                        <div className="member-avatar" aria-hidden="true">
                            <span className="avatar-text">JB</span>
                            <div className="member-role-badge backend" aria-hidden="true">Backend</div>
                        </div>
                        <div className="member-info">
                            <h3 id="member-jb-name">Juliana Bolaños</h3>
                            <p id="member-jb-role">Back Developer</p>
                        </div>
                    </article>

                    {/* Member 3 */}
                    <article
                        role="listitem"
                        className="team-member"
                        tabIndex={0}
                        aria-labelledby="member-jm-name"
                        aria-describedby="member-jm-role"
                    >
                        <div className="member-avatar" aria-hidden="true">
                            <span className="avatar-text">JM</span>
                            <div className="member-role-badge frontend" aria-hidden="true">Frontend</div>
                        </div>
                        <div className="member-info">
                            <h3 id="member-jm-name">Juan Moreno</h3>
                            <p id="member-jm-role">Front Developer</p>
                        </div>
                    </article>

                    {/* Member 4 */}
                    <article
                        role="listitem"
                        className="team-member"
                        tabIndex={0}
                        aria-labelledby="member-gg-name"
                        aria-describedby="member-gg-role"
                    >
                        <div className="member-avatar" aria-hidden="true">
                            <span className="avatar-text">GG</span>
                            <div className="member-role-badge backend" aria-hidden="true">Backend</div>
                        </div>
                        <div className="member-info">
                            <h3 id="member-gg-name">Gabriela Guzman</h3>
                            <p id="member-gg-role">Back Developer</p>
                        </div>
                    </article>

                    {/* Member 5 */}
                    <article
                        role="listitem"
                        className="team-member"
                        tabIndex={0}
                        aria-labelledby="member-ls-name"
                        aria-describedby="member-ls-role"
                    >
                        <div className="member-avatar" aria-hidden="true">
                            <span className="avatar-text">LS</span>
                            <div className="member-role-badge frontend" aria-hidden="true">Frontend</div>
                        </div>
                        <div className="member-info">
                            <h3 id="member-ls-name">Laura Salazar</h3>
                            <p id="member-ls-role">Front Developer</p>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    )
}
export default AboutUs;