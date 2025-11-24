import React from "react";
import './Dashboard.scss';
import CameraIcon from '/logos/camera.svg?url';
import CodeIcon from '/logos/code.svg?url';
import LockIcon from '/logos/lock.svg?url';
import { useNavigate } from "react-router-dom";

/**
 * Dashboard page component.
 *
 * Displays a hero section with actions to create a meeting or join one by ID,
 * and a list of feature cards. Uses `useNavigate` to:
 * - navigate to '/meeting' when creating a meeting.
 *
 * Note: the join input currently has no submit handler in this component.
 *
 * @component
 * @returns {JSX.Element} The Dashboard page markup.
 */

const Dashboard: React.FC = () => {

    const navigate = useNavigate();
    

    return (
        <div className="container-dashboard">
            <main className="hero">
                <div className="hero-content">
                    <h1>Empieza a comunicarte de forma <span className="highlight">más fácil y rápida</span> ahora mismo</h1>
                    <p className="hero-subtitle">
                        Conecta con tu equipo desde cualquier lugar. Crea o únete a reuniones de manera instantánea.
                    </p>

                    <div className="actions">
                        <button className="primary-btn" onClick={() => navigate('/meeting')}>
                            <span className="btn-icon">🎥</span>
                            <span>Crear Reunión</span>
                        </button>

                        <div className="divider">
                            <span>o</span>
                        </div>

                        <div className="join-section">
                            <div className="join-row">
                                <input 
                                    className="join-input" 
                                    placeholder="Ingresa el ID de la reunión" 
                                />
                                <button className="join-btn">
                                    <span>⚡ Unirse</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="features">
                    <div className="features-header">
                        <h2>¿Cómo funciona?</h2>
                    </div>
                    
                    <div className="features-grid">
                        <article className="feature">
                            <div className="icon-circle">
                                <img src={CameraIcon} alt="camera" />
                            </div>
                            <h3>Obtén un ID para compartir</h3>
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
                            <h3>Mantén segura tu reunión</h3>
                            <p>Evita compartir a personas ajenas el ID de tu reunión</p>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard;
