import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from '../../stores/useAuthStore';
import './Dashboard.scss';
import CameraIcon from '/logos/camera.svg?url';
import CodeIcon from '/logos/code.svg?url';
import LockIcon from '/logos/lock.svg?url';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="container-dashboard">
            <header className="topbar">
                <Link to="/" className="nav-logo-link">
                          <img
                            src="/logo-synk.png"
                            alt="Synk Logo"
                            className="nav-logo"
                          />      
                        </Link>

                <div className="user-area" ref={menuRef}>
                    <button
                        className="user-btn"
                        aria-haspopup="true"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((s) => !s)}
                    >
                        <span className="user-initial">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </button>

                    {menuOpen && (
                        <div className="user-menu" role="menu">
                            <Link to="/profile" className="user-menu-item" role="menuitem">Configuración</Link>
                            <button className="user-menu-item" role="menuitem" onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </header>

            <main className="hero">
                <h1>Empieza a comunicarte de forma mas facil y rapida ahora mismo</h1>

                <div className="actions">
                    <button className="primary-btn">Crear reunión</button>

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
