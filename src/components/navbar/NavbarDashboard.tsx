
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

	useEffect(() => {
		console.log("[NavbarDashboard] user (store):", user);
		console.log("[NavbarDashboard] cachedUser:", cachedUser);
	}, [user, cachedUser]);

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

	return (
		<nav className="navbar-dashboard">
			<div className="nav-container">
				<div className="nav-left">
					<Link to="/dashboard" className="nav-logo-link">
						<img src="/logo-synk.png" alt="Logo" className="nav-logo" />
					</Link>
				</div>

				<div className="nav-right" ref={menuRef}>
				<button
                    className="user-btn"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((s) => !s)}
                    title={displayNameTitle()}
                >
                    <span className="user-initial">
                        {getUserInitial()}
                    </span>
                </button>

				{menuOpen && (
					<div className="user-menu" role="menu">
						<Link to="/profile" className="user-menu-item" role="menuitem">
							Perfil
						</Link>
						<button
							className="user-menu-item"
							role="menuitem"
							onClick={showLogoutConfirmation}
						>
							Cerrar sesión
						</button>
					</div>
				)}
				</div>
			</div>

			{/* Modal de confirmación de logout */}
			{showLogoutModal && (
				<div className="logout-modal-overlay">
					<div className="logout-modal">
						<h3>¿Cerrar sesión?</h3>
						<p>¿Estás seguro de que quieres cerrar tu sesión?</p>
						<div className="logout-modal-actions">
							<button 
								className="logout-cancel-btn" 
								onClick={() => setShowLogoutModal(false)}
							>
								Cancelar
							</button>
							<button 
								className="logout-confirm-btn" 
								onClick={handleLogout}
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
