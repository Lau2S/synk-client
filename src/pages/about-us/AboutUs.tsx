import React from "react";
import './AboutUs.scss';
import { useNavigate } from "react-router-dom";

const AboutUs: React.FC = () => {
    const navigate = useNavigate();
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

            <h2>Nuestro Equipo</h2>

            <div className="content-group">
                <div className="box">
                    <h3>Valentina Sanchez</h3>
                    <p>Front Developer</p>
                </div>

                <div className="box">
                    <h3>Juliana Bolaños</h3>
                    <p>Back Developer</p>
                </div>

                <div className="box">
                    <h3>Juan <br />Moreno</h3>
                    <p>Front Developer</p>
                </div>

                <div className="box">
                    <h3>Gabriela Guzman</h3>
                    <p>Back Developer</p>
                </div>

                <div className="box">
                    <h3>Laura <br />Salazar</h3>
                    <p>Front Developer</p>
                </div>
                
            </div>
        </div>
    )
}
export default AboutUs;