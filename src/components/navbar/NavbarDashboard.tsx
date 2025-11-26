
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
				>
					<span className="user-initial">
						{user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
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
