import React from "react";
import './Dashboard.scss';
import CameraIcon from '/logos/camera.svg?url';
import CodeIcon from '/logos/code.svg?url';
import LockIcon from '/logos/lock.svg?url';
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {

    const navigate = useNavigate();
    

    return (
        <div className="container-dashboard">
            

            <main className="hero">
                <h1>Empieza a comunicarte de forma mas facil y rapida ahora mismo</h1>

                <div className="actions">
                    <button className="primary-btn" onClick={() => navigate('/meeting')}>Crear reunión</button>

                    <div className="join-row">
                        <input className="join-input" placeholder="Ingrese el ID de la reunión" />
                        <button className="join-btn">Unirse</button>
                    </div>
                </div>

                <section className="features">
                    <article className="feature">
                        <div className="icon-circle">
                            <img src={CameraIcon} alt="camera" />
                        </div>
                        <h3>Obten un ID para compartir</h3>
                        <p>Toca el botón Crear Reunión para generar un ID que puedes compartir con quien desees</p>
                    </article>

                    <article className="feature">
                        <div className="icon-circle">
                            <img src={CodeIcon} alt="codigo" />
                        </div>
                        <h3>Ingresa a una reunión con un ID</h3>
                        <p>Ingresa un ID que te hayan compartido para entrar a una reunión</p>
                    </article>

                    <article className="feature">
                        <div className="icon-circle">
                            <img src={LockIcon} alt="seguridad" />
                        </div>
                        <h3>Manten segura tu reunión</h3>
                        <p>Evita compartir a personas ajenas el ID de tu reunión</p>
                    </article>
                </section>
            </main>

            
        </div>
    )
}

export default Dashboard;
