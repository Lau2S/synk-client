import React from 'react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';

/**
 * Home page component.
 *
 * Shows marketing text and a call-to-action button that redirects users to the
 * login page. No props.
 *
 * @component
 * @returns {JSX.Element} The Home page markup.
 */

const Home: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Navigate to the login route when the CTA button is clicked.
     *
     * @returns {void}
     */

    return (
        <main id="home-main" className="container-home" role="main" aria-labelledby="home-title">
            <div className="content-left" role="region" aria-describedby="home-desc">
                <h1 id="home-title">Sincroniza tu equipo, maximiza tu impacto</h1>

                <p id="home-desc">
                    La comunicación efectiva impulsa la productividad. Con Synk, tus equipos trabajan en
                    perfecta sincronía para tomar decisiones más rápidas y generar un mayor impacto.
                </p>

                <div className="home-actions" role="group" aria-label="Acciones principales">
                    <button
                        className="cta-button"
                        onClick={() => navigate('/login')}
                        aria-label="Ir a iniciar sesión"
                    >
                        Acceder
                    </button>
                </div>
            </div>

            <div className="content-right" role="region" aria-hidden="false" aria-label="Imagen ilustrativa">
                <img
                    src="home-image.png"
                    alt="Personas colaborando en una videollamada, mostrando la interfaz de Synk"
                    className="home-hero-image"
                />
            </div>
        </main>
    )
}

export default Home;