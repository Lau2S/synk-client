import React, { useEffect, useRef, useState } from 'react'
import useAuthStore from '../../stores/useAuthStore'
import { Link, useNavigate } from 'react-router-dom';
import './Profile.scss';

const Profile: React.FC = () => {
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
    const handleEdit = () => {
        // Lógica para editar el perfil
        alert('Funcionalidad de edición de perfil no implementada.');
    }
    const handleDelete = () => {
        // Lógica para eliminar la cuenta
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
        if (confirmed) {
            // Aquí iría la lógica para eliminar la cuenta
            alert('Funcionalidad de eliminación de cuenta no implementada.');
        }
    }

    return (
        <div className="container-profile">
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
                        title="Usuario"
                    >
                        <span className="user-initial">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </button>

                    {menuOpen && (
                        <div className="user-menu" role="menu">
                            
                            <button className="user-menu-item" role="menuitem" onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </header>

            <div className="profile-card-wrapper">
                <div className="profile-card">
                    <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">⟵</button>

                    <div className="avatar-wrap">
                        <span className="avatar">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </div>

                    <h2 className="profile-name">{user?.displayName ?? 'Mi nombre'}</h2>

                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{user?.email ?? '—'}</span>
                        </div>

                        <div className="info-row">
                            <span className="label">Edad:</span>
                            <span className="value">{(user as any)?.age ?? '—'}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="profile-button" onClick={handleEdit}>Editar Perfil</button>
                        <button className="delete-button" onClick={handleDelete}>Eliminar Cuenta</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile