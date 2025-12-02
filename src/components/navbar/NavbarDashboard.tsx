
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import "./NavbarDashboard.scss";

/**
 * NavbarDashboard component - top navigation used in authenticated dashboard pages.
 *
 * Responsibilities:
 * - Render app logo linking to /dashboard.
 * - Show a user button with the user's initial (fallback "U").
 * - Toggle a small user menu with links for profile/settings and logout.
 * - Close the menu when clicking outside of it.
 *
 * No props. Uses the auth store for user state and logout action.
 *
 * @component
 * @returns {JSX.Element} Navbar element for dashboard layout.
 */

const NavbarDashboard: React.FC = () => {
	const navigate = useNavigate();
	const logout = useAuthStore((s) => s.logout);
	const user = useAuthStore((s) => s.user);

	const [menuOpen, setMenuOpen] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

	const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
    const secondMenuItemRef = useRef<HTMLButtonElement | null>(null);
    const userButtonRef = useRef<HTMLButtonElement | null>(null);

	const [cachedUser, setCachedUser] = useState<any | null>(() => {
		if (user) return user;
		try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
	});
	
	useEffect(() => {
		// priorizar el user del store; si no está, intentar leer localStorage
		if (user) {
			setCachedUser(user);
			return;
		}
		try {
			const raw = localStorage.getItem('user') || localStorage.getItem('profile') || null;
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed && Object.keys(parsed).length > 0) setCachedUser(parsed);
			}
		} catch (e) {
			// noop
		}
	}, [user]);

	const getUserInitial = () => {
        const src =
            (cachedUser as any)?.firstName ||
            cachedUser?.displayName ||
            (cachedUser as any)?.name ||
            (cachedUser as any)?.email ||
            (cachedUser as any)?.id ||
            "";

        if (!src || typeof src !== "string") return "U";
        let candidate = src;
        if (candidate.includes("@")) candidate = candidate.split("@")[0];
        if (candidate.includes(" ")) candidate = candidate.split(" ")[0];
        return (candidate.trim().charAt(0) || "U").toUpperCase();
    };

	const displayNameTitle = () => {
        return (
            (cachedUser as any)?.firstName ||
            cachedUser?.displayName ||
            (cachedUser as any)?.email ||
            "Usuario"
        );
    };

	

	/**
     * Close the menu when clicking outside the menu container.
     *
     * The effect attaches a 'mousedown' listener on mount and removes it on unmount.
     */

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	useEffect(() => {
        if (menuOpen) {
            // small delay to ensure DOM is ready
            setTimeout(() => firstMenuItemRef.current?.focus(), 0);
        } else {
            // restore focus to user button when menu closes
            userButtonRef.current?.focus();
        }
    }, [menuOpen]);

	const onUserButtonKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMenuOpen((s) => !s);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setMenuOpen(true);
        }
    };

	const onMenuKeyDown = (e: React.KeyboardEvent) => {
        const items = [firstMenuItemRef.current, secondMenuItemRef.current].filter(Boolean) as HTMLElement[];
        const idx = items.indexOf(document.activeElement as HTMLElement);
        if (e.key === "Escape") {
            setMenuOpen(false);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = items[(idx + 1) % items.length];
            next?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = items[(idx - 1 + items.length) % items.length];
            prev?.focus();
        }
    };

	/**
     * Show logout confirmation modal
     */
	const showLogoutConfirmation = () => {
		setMenuOpen(false);
		setShowLogoutModal(true);
	};

	/**
     * Perform logout via the auth store and navigate to the login page.
     *
     * @async
     * @returns {Promise<void>}
     */
	const handleLogout = async () => {
		setShowLogoutModal(false);
		await logout();
		navigate("/login");
	};

	const logoutCancelRef = useRef<HTMLButtonElement | null>(null);
    const logoutConfirmRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        if (showLogoutModal) {
            setTimeout(() => logoutCancelRef.current?.focus(), 0);
            const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowLogoutModal(false); };
            document.addEventListener("keydown", onKey);
            return () => document.removeEventListener("keydown", onKey);
        }
    }, [showLogoutModal]);

	return (
		<nav className="navbar-dashboard" role="navigation" aria-label="Barra de navegación principal">
            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/dashboard" className="nav-logo-link" aria-label="Ir al panel">
                        <img src="/logo-synk.png" alt="Logo Synk" className="nav-logo" />
                    </Link>
                </div>

                <div className="nav-right" ref={menuRef}>
                    <button
                        ref={userButtonRef}
                        className="user-btn"
                        aria-haspopup="true"
                        aria-controls="user-menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((s) => !s)}
                        onKeyDown={onUserButtonKeyDown}
                        title={displayNameTitle()}
                        aria-label={`Abrir menú de usuario, ${displayNameTitle()}`}
                    >
                        <span className="user-initial" aria-hidden="false">
                            {getUserInitial()}
                        </span>
                    </button>

                    {menuOpen && (
                        <div
                            id="user-menu"
                            className="user-menu"
                            role="menu"
                            aria-label="Menú de usuario"
                            onKeyDown={onMenuKeyDown}
                        >
                            <Link
                                to="/profile"
                                className="user-menu-item"
                                role="menuitem"
                                ref={firstMenuItemRef}
                            >
                                Perfil
                            </Link>
                            <button
                                className="user-menu-item"
                                role="menuitem"
                                onClick={showLogoutConfirmation}
                                ref={secondMenuItemRef}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación de logout */}
            {showLogoutModal && (
                <div className="logout-modal-overlay" role="presentation" aria-hidden={false}>
                    <div
                        className="logout-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="logout-modal-title"
                        aria-describedby="logout-modal-desc"
                    >
                        <h3 id="logout-modal-title">¿Cerrar sesión?</h3>
                        <p id="logout-modal-desc">¿Estás seguro de que quieres cerrar tu sesión?</p>
                        <div className="logout-modal-actions">
                            <button
                                className="logout-cancel-btn"
                                onClick={() => setShowLogoutModal(false)}
                                ref={logoutCancelRef}
                            >
                                Cancelar
                            </button>
                            <button
                                className="logout-confirm-btn"
                                onClick={handleLogout}
                                ref={logoutConfirmRef}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
	);
};

export default NavbarDashboard;
