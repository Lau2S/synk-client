
import React, { useEffect, useState } from 'react'
import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom';
import './Profile.scss';
import { getMe, updateUser, deleteUser } from '../../api/users';

/**
 * Profile page component.
 *
 * Shows the authenticated user's profile, allows editing profile fields,
 * and provides account deletion. Fetches the server profile via getMe on mount
 * and when the store user changes.
 *
 * Behavior:
 * - Edit modal: update profile and optionally change password.
 * - Delete modal: confirm deletion, call deleteUser, then logout and redirect.
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} Profile page markup and behavior.
 */


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const storeUser = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);

    // server profile (fetched)
    const [profile, setProfile] = useState<any | null>(null);
    const [, setLoadingProfile] = useState(false);
    const [, setLoadError] = useState<string | null>(null);

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

    /**
     * Load profile from server on mount and when store user changes.
     * Populates local form state with fetched values.
     */
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

    /**
     * Open edit modal and populate fields with current profile data.
     */

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

    /**
     * Submit profile edits to the backend.
     *
     * - Validates password confirmation if changing password.
     * - Builds payload and calls updateUser.
     * - Refreshes profile via getMe and updates auth store displayName/email if setter exists.
     *
     * @param {React.FormEvent} e - Form submit event.
     * @async
     * @returns {Promise<void>}
     */

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

    /**
     * Submit account deletion.
     *
     * - Validates password presence and profile id.
     * - Calls deleteUser and on success logs out, clears store user and navigates to home.
     *
     * @param {React.FormEvent|undefined} e - Optional form event.
     * @async
     * @returns {Promise<void>}
     */

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
                            <span className="label">Email: </span>
                            <span className="value">{profile?.email ?? storeUser?.email ?? '—'}</span>
                        </div>

                        <div className="info-row">
                            <span className="label">Edad: </span>
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
                <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title" aria-describedby="edit-modal-desc">
                    <div className="modal-overlay" onClick={() => setShowEdit(false)} />
                    <div className="modal-content" role="document">
                        <button className="modal-close-btn" onClick={() => setShowEdit(false)} aria-label="Cerrar diálogo de editar">✕</button>
                        <h2 id="edit-modal-title" className="modal-title">Edita Tu Perfil</h2>
                        <p id="edit-modal-desc" className="modal-subtitle">Deja en blanco para mantener la contraseña actual</p>

                        <form className="modal-form" onSubmit={handleEditSubmit} aria-describedby={editMsg ? 'edit-message' : undefined}>
                            <input
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              placeholder="Nombre"
                              className="modal-input"
                              aria-label="Nombre"
                              autoFocus
                            />
                            <input
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              placeholder="Apellido"
                              className="modal-input"
                              aria-label="Apellido"
                            />
                            <input
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              type="email"
                              placeholder="Email"
                              className="modal-input"
                              aria-label="Email"
                            />
                            <input
                              value={String(editAge)}
                              onChange={(e) => setEditAge(e.target.value === '' ? '' : Number(e.target.value))}
                              placeholder="Edad"
                              className="modal-input"
                              aria-label="Edad"
                            />
                            <input
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              type="password"
                              placeholder="Nueva Contraseña"
                              className="modal-input"
                              aria-label="Nueva contraseña"
                            />
                            <input
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              type="password"
                              placeholder="Confirmar nueva contraseña"
                              className="modal-input"
                              aria-label="Confirmar nueva contraseña"
                            />

                            {editMsg && <div id="edit-message" className="modal-info" role="alert" aria-live="assertive">{editMsg}</div>}

                            {/* Mantengo el mismo orden visual: Guardar (submit) luego Cancelar */}
                            <button type="submit" className="modal-primary-btn" disabled={editSending} aria-busy={editSending}>
                                {editSending ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button type="button" className="modal-cancel-btn" onClick={() => setShowEdit(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete modal (orden visual preservado) */}
            {showDelete && (
                <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" aria-describedby="delete-modal-desc">
                    <div className="modal-overlay" onClick={() => setShowDelete(false)} />
                    <div className="modal-content" role="document">
                        <button className="modal-close-btn" onClick={() => setShowDelete(false)} aria-label="Cerrar diálogo de eliminar">✕</button>
                        <h2 id="delete-modal-title" className="modal-title">Eliminar Cuenta</h2>
                        <p id="delete-modal-desc" className="modal-subtitle">Esta acción eliminará permanentemente tu cuenta</p>

                        <form className="modal-form" onSubmit={handleDeleteSubmit} aria-describedby={deleteMsg ? 'delete-message' : undefined}>
                            <input
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              type="password"
                              placeholder="Ingresa tu contraseña para confirmar"
                              className="modal-input"
                              aria-label="Contraseña para confirmar eliminación"
                            />
                            {deleteMsg && <div id="delete-message" className="modal-info" role="alert" aria-live="assertive">{deleteMsg}</div>}

                            {/* Mantengo el mismo orden visual: Eliminar (confirm) luego Cancelar */}
                            <button type="button" className="modal-danger-btn" onClick={() => handleDeleteSubmit()} disabled={deleteSending} aria-busy={deleteSending}>
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
