import React, { useState } from 'react'
import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom';
import './Profile.scss';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);

    // modales / formularios
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [editName, setEditName] = useState(user?.displayName ?? '');
    const [editLastName, setEditLastName] = useState('');
    const [editAge, setEditAge] = useState((user as any)?.age ?? '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editSending, setEditSending] = useState(false);
    const [editMsg, setEditMsg] = useState('');

    const [deletePassword, setDeletePassword] = useState('');
    const [deleteSending, setDeleteSending] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState('');

    

    const handleEditOpen = () => {
        setEditName(user?.displayName ?? '');
        setEditLastName('');
        setEditAge((user as any)?.age ?? '');
        setNewPassword('');
        setConfirmPassword('');
        setEditMsg('');
        setShowEdit(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            setEditMsg('Las contraseñas no coinciden.');
            return;
        }
        setEditSending(true);
        setEditMsg('');
        try {
            // Simulación: actualiza el store localmente. Reemplazar por llamada real a backend/firebase si aplica
            const newDisplay = [editName, editLastName].filter(Boolean).join(' ') || user?.displayName || null;
            setUser({
                displayName: newDisplay,
                email: user?.email ?? null,
                photoURL: user?.photoURL ?? null,
            });
            // si necesitas guardar edad u contraseña, añadir llamada real aquí
            setEditMsg('Perfil actualizado.');
            setTimeout(() => {
                setShowEdit(false);
                setEditMsg('');
            }, 900);
        } catch (err) {
            setEditMsg('No se pudo actualizar, intenta de nuevo.');
        } finally {
            setEditSending(false);
        }
    };

    const handleDeleteSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!deletePassword) {
            setDeleteMsg('Ingresa tu contraseña para confirmar.');
            return;
        }
        setDeleteSending(true);
        setDeleteMsg('');
        try {
            // Simulación de eliminación: en producción llamar a la API o reautenticación + eliminación
            // Aquí sólo desloguea y redirige
            await new Promise((res) => setTimeout(res, 900));
            await logout();
            
            
            navigate('/');
        } catch (err) {
            setDeleteMsg('No se pudo eliminar la cuenta. Intenta de nuevo.');
            setDeleteSending(false);
        }
    };

    const handleEdit = () => handleEditOpen();

    const handleDelete = () => {
        setDeletePassword('');
        setDeleteMsg('');
        setShowDelete(true);
    }

    return (
        <div className="container-profile">
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

            {/* Edit modal */}
            {showEdit && (
                <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Editar Perfil">
                    <div className="modal-overlay" onClick={() => setShowEdit(false)} />
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={() => setShowEdit(false)}>✕</button>
                        <h2 className="modal-title">Edita Tu Perfil</h2>
                        <p className="modal-subtitle">Deja en blanco para mantener tu contraseña actual</p>

                        <form className="modal-form" onSubmit={handleEditSubmit}>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Mi nombre" className="modal-input" />
                            <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} placeholder="Mi apellido" className="modal-input" />
                            <input value={String(editAge)} onChange={(e) => setEditAge(e.target.value)} placeholder="Mi edad" className="modal-input" />
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Nueva Contraseña" className="modal-input" />
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirmar nueva contraseña" className="modal-input" />

                            {editMsg && <div className="modal-info">{editMsg}</div>}

                            <button type="submit" className="modal-primary-btn" disabled={editSending}>
                                {editSending ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button type="button" className="modal-cancel-btn" onClick={() => setShowEdit(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete modal */}
            {showDelete && (
                <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Eliminar Cuenta">
                    <div className="modal-overlay" onClick={() => setShowDelete(false)} />
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={() => setShowDelete(false)}>✕</button>
                        <h2 className="modal-title">Eliminar Cuenta</h2>
                        <p className="modal-subtitle">Esta acción eliminará permanentemente tu cuenta</p>

                        <form className="modal-form" onSubmit={handleDeleteSubmit}>
                            <input value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} type="password" placeholder="Ingresa tu contraseña para confirmar" className="modal-input" />
                            {deleteMsg && <div className="modal-info">{deleteMsg}</div>}

                            <button type="button" className="modal-danger-btn" onClick={() => handleDeleteSubmit()} disabled={deleteSending}>
                                {deleteSending ? 'Eliminando...' : 'Eliminar'}
                            </button>
                            <button type="button" className="modal-cancel-btn" onClick={() => setShowDelete(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile