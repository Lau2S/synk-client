
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import "./NavbarDashboard.scss";

const NavbarDashboard: React.FC = () => {
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
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleLogout = async () => {
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
							Configuración
						</Link>
						<button
							className="user-menu-item"
							role="menuitem"
							onClick={handleLogout}
						>
							Cerrar sesión
						</button>
					</div>
				)}
				</div>
			</div>
		</nav>
	);
};

export default NavbarDashboard;
