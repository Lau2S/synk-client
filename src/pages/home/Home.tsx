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
        <div className='container-home'>
            <div className="content-left">
                <h1>Sincroniza tu equipo, maximiza tu impacto</h1>
                
                <p>
                    La comunicación efectiva impulsa la productividad. 
                    Con Synk, tus equipos trabajan en perfecta sincronía para 
                    tomar decisiones más rápidas y generar un mayor impacto.
                </p>

                <button onClick={() => navigate('/login')}>Acceder</button>
            </div>

            <div className="content-right">
                <img src="home-image.png" alt="Imagen de inicio" />
            </div>
        </div>
    )
}

export default Home;