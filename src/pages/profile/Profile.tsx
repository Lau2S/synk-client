
import React, { useEffect, useState } from 'react'
import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom';
import './Profile.scss';
import { getMe, updateUser, deleteUser } from '../../api/users';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const storeUser = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);

    // server profile (fetched)
    const [profile, setProfile] = useState<any | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // modales / formularios
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editAge, setEditAge] = useState<number | ''>('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editSending, setEditSending] = useState(false);
    const [editMsg, setEditMsg] = useState('');

    const [deletePassword, setDeletePassword] = useState('');
    const [deleteSending, setDeleteSending] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState('');

    // load profile on mount (or when store user changes)
    useEffect(() => {
        const load = async () => {
            setLoadingProfile(true);
            setLoadError(null);
            try {
                const data = await getMe();
                setProfile(data);
                // populate form defaults
                setEditFirstName(data?.firstName ?? '');
                setEditLastName(data?.lastName ?? '');
                setEditEmail(data?.email ?? '');
                setEditAge(typeof data?.age === 'number' ? data.age : (data?.age ? Number(data.age) : ''));
            } catch (err: any) {
                setLoadError(err?.message || err?.response?.message || 'No se pudo cargar el perfil');
            } finally {
                setLoadingProfile(false);
            }
        };
        load();
    }, [storeUser]);

    const handleEditOpen = () => {
        setEditFirstName(profile?.firstName ?? '');
        setEditLastName(profile?.lastName ?? '');
        setEditEmail(profile?.email ?? '');
        setEditAge(typeof profile?.age === 'number' ? profile.age : (profile?.age ? Number(profile.age) : ''));
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
        if (!profile?.id) {
            setEditMsg('Perfil no cargado');
            return;
        }
        setEditSending(true);
        setEditMsg('');
        try {
            const payload: any = {
                firstName: editFirstName,
                lastName: editLastName,
                age: editAge === '' ? undefined : Number(editAge),
            };
            // if you want backend to handle password change, include newPassword (ensure backend supports it)
            if (newPassword) payload.password = newPassword;
            if (editEmail && editEmail !== profile?.email) payload.email = editEmail;

            await updateUser(profile.id, payload);
            // refresh profile
            const refreshed = await getMe();
            setProfile(refreshed);
            // update store user displayName/email/photo if needed
            if (setUser) {
                setUser({
                    displayName: `${refreshed.firstName ?? ''} ${refreshed.lastName ?? ''}`.trim() || storeUser?.displayName,
                    email: refreshed.email ?? storeUser?.email,
                    photoURL: refreshed.photo ?? storeUser?.photoURL,
                } as any);
            }
            setEditMsg('Perfil actualizado.');
            setTimeout(() => {
                setShowEdit(false);
                setEditMsg('');
            }, 900);
        } catch (err: any) {
            setEditMsg(err?.message || err?.response?.message || 'No se pudo actualizar, intenta de nuevo.');
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
        if (!profile?.id) {
            setDeleteMsg('Perfil no cargado.');
            return;
        }
        setDeleteSending(true);
        setDeleteMsg('');
        try {
            // if backend requires re-auth, call appropriate endpoint; here we call DELETE /users/:id
            await deleteUser(profile.id);
            // logout and clear store
            await logout();
            if (setUser) setUser(null as any);
            navigate('/');
        } catch (err: any) {
            setDeleteMsg(err?.message || err?.response?.message || 'No se pudo eliminar la cuenta. Intenta de nuevo.');
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
                            {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : (storeUser?.displayName ? storeUser.displayName.charAt(0).toUpperCase() : 'U')}
                        </span>
                    </div>

                    <h2 className="profile-name">{profile ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() : (storeUser?.displayName ?? 'Mi nombre')}</h2>

                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{profile?.email ?? storeUser?.email ?? '—'}</span>
                        </div>

                        <div className="info-row">
                            <span className="label">Edad:</span>
                            <span className="value">{profile?.age ?? (storeUser as any)?.age ?? '—'}</span>
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
                            <input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} placeholder="Nombre" className="modal-input" />
                            <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} placeholder="Apellido" className="modal-input" />
                            <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" placeholder="Email" className="modal-input" />
                            <input value={String(editAge)} onChange={(e) => setEditAge(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Edad" className="modal-input" />
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

//change to commit