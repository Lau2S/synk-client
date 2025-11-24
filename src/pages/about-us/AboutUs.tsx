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
        <div className='container-about-us'>
            <div className="main-container">
                <h1>Sobre Nosotros</h1>
                
                <p>
                    Somos un grupo de desarrolladores, diseñadores y entusiastas de la tecnología comprometidos con mejorar
                    la forma en que las personas colaboran a distancia. Nuestro trabajo combina innovación, diseño intuitivo y
                    tecnología de vanguardia para ofrecer una experiencia de reunión estable, fluida y accesible desde cualquier dispositivo.
                </p>

                <p>
                    Nuestro objetivo es seguir evolucionando, escuchando a nuestros usuarios y mejorando cada día, para que trabajar,
                    estudiar o reunirse en línea sea tan natural como estar cara a cara.
                </p>

                <button onClick={() => navigate('/login')}>Acceder</button>
            </div>

            <div className="team-section">
                <h2>Nuestro Equipo</h2>
                
                <div className="team-grid">
                    <div className="team-member">
                        <div className="member-avatar">
                            <span className="avatar-text">VS</span>
                            <div className="member-role-badge frontend">Frontend</div>
                        </div>
                        <div className="member-info">
                            <h3>Valentina Sanchez</h3>
                            <p>Front Developer</p>
                        </div>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar">
                            <span className="avatar-text">JB</span>
                            <div className="member-role-badge backend">Backend</div>
                        </div>
                        <div className="member-info">
                            <h3>Juliana Bolaños</h3>
                            <p>Back Developer</p>
                        </div>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar">
                            <span className="avatar-text">JM</span>
                            <div className="member-role-badge frontend">Frontend</div>
                        </div>
                        <div className="member-info">
                            <h3>Juan Moreno</h3>
                            <p>Front Developer</p>
                        </div>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar">
                            <span className="avatar-text">GG</span>
                            <div className="member-role-badge backend">Backend</div>
                        </div>
                        <div className="member-info">
                            <h3>Gabriela Guzman</h3>
                            <p>Back Developer</p>
                        </div>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar">
                            <span className="avatar-text">LS</span>
                            <div className="member-role-badge frontend">Frontend</div>
                        </div>
                        <div className="member-info">
                            <h3>Laura Salazar</h3>
                            <p>Front Developer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AboutUs;