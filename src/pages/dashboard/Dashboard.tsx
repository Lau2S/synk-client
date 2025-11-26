import React, { useState } from "react";
import './Dashboard.scss';
import CameraIcon from '/logos/camera.svg?url';
import CodeIcon from '/logos/code.svg?url';
import LockIcon from '/logos/lock.svg?url';
import { useNavigate } from "react-router-dom";
import { createMeeting, joinMeeting } from "../../api/meetings";
import useAuthStore from "../../stores/useAuthStore";

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
    const user = useAuthStore((s) => s.user);
    const [joinMeetingId, setJoinMeetingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle creating a new meeting
     */
    const handleCreateMeeting = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Obtener el userId del usuario autenticado
            const hostId = (user as any)?.uid || user?.email || 'anonymous';
            const title = `Reunión de ${user?.displayName || user?.email || 'Usuario'}`;
            
            // Crear la reunión en el backend
            const meeting = await createMeeting(hostId, title);
            
            // Navegar a la página de reunión con el ID
            navigate(`/meeting/${meeting.meetingId}`);
        } catch (err: any) {
            setError(err?.message || 'Error al crear la reunión');
            console.error('Error creating meeting:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle joining an existing meeting
     */
    const handleJoinMeeting = async () => {
        if (!joinMeetingId.trim()) {
            setError('Ingresa un ID de reunión válido');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userId = (user as any)?.uid || user?.email || 'anonymous';
            
            // Unirse a la reunión
            await joinMeeting(joinMeetingId, userId);
            
            // Navegar a la página de reunión
            navigate(`/meeting/${joinMeetingId}`);
        } catch (err: any) {
            setError(err?.message || 'Error al unirse a la reunión');
            console.error('Error joining meeting:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-dashboard">
            <main className="hero">
                <div className="hero-content">
                    <h1>Empieza a comunicarte de forma <span className="highlight">más fácil y rápida</span> ahora mismo</h1>
                    <p className="hero-subtitle">
                        Conecta con tu equipo desde cualquier lugar. Crea o únete a reuniones de manera instantánea.
                    </p>

                    {error && (
                        <div style={{ 
                            background: 'rgba(231, 76, 60, 0.1)', 
                            border: '1px solid rgba(231, 76, 60, 0.3)',
                            color: '#e74c3c',
                            padding: '1rem',
                            borderRadius: '10px',
                            marginBottom: '1rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="actions">
                        <button 
                            className="primary-btn" 
                            onClick={handleCreateMeeting}
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Crear Reunión'}
                        </button>

                        <div className="divider">
                            <span>o</span>
                        </div>

                        <div className="join-section">
                            <div className="join-row">
                                <input 
                                    className="join-input" 
                                    placeholder="Ingresa el ID de la reunión"
                                    value={joinMeetingId}
                                    onChange={(e) => setJoinMeetingId(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleJoinMeeting();
                                        }
                                    }}
                                />
                                <button 
                                    className="join-btn"
                                    onClick={handleJoinMeeting}
                                    disabled={loading}
                                >
                                    {loading ? 'Uniéndose...' : 'Unirse'}
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
