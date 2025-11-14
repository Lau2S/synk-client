import React from 'react';
import './Home.scss';
const Home: React.FC = () => {
    return (
        <div className='container-home'>

            <h1>Sincroniza tu equipo, maximiza tu impacto</h1>
            
            <p>La comunicación efectiva impulsa la productividad. <br/>
            Con Synk, tus equipos trabajan en perfecta sincronía para tomar decisiones <br />
             más rápidas y generar un mayor impacto.</p>

             <img src="home-image.png" alt="Imagen de inicio" />

             <button>Acceder</button>

        </div>
    )
}

export default Home;
 