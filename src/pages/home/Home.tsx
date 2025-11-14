import React from 'react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

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