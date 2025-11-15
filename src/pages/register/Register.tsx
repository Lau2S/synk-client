import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { useEffect } from 'react';
import './Register.scss';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, initAuthObserver } = useAuthStore();

    const handleLoginGoogle = (e: React.FormEvent) => {
        e.preventDefault();
        loginWithGoogle().then(() => navigate('/profile'));
    }

    useEffect(() => {
        const unsub = initAuthObserver();
        return () => unsub();
    }, [initAuthObserver]);

    return (
      <div className="container-register">
        <div className="register-card">
          <h2>Registrate</h2>
          <p>Crea una cuenta en Synk para acceder a la aplicación </p>

          <form className="register-form">
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder="Ingresa tu Nombre"
                //value={name}
                //onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                id="lastName"
                placeholder="Ingresa tu Apellido"
                //value={lastName}
                //onChange={(e) => setLastName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                id="edad"
                placeholder="Ingresa tu Edad"
                //value={edad}
                //onChange={(e) => setEdad(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu Email"
                //value={email}
                //onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu Contraseña"
                //value={password}
                //onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirma tu Contraseña"
                //value={confirmPassword}
                //onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </form>

          <button className="register-button">Registrarse</button>

          <div className="separator">
            <span>o</span>
          </div>

          <div className="register-options">
            <button
              className="google-register-button"
              onClick={handleLoginGoogle}
            >
              <img src="logos/google-logo.png" alt="Registrarse con Google" />
              <span>Usa Google</span>
            </button>

            <button
              className="facebook-register-button"
              onClick={handleLoginGoogle}
            >
              <img
                src="logos/facebook-logo.png"
                alt="Registrarse con Facebook"
              />
              <span>Usa Facebook</span>
            </button>
          </div>

          <div className="register-prompt">
            <span>¿Ya tienes una cuenta? </span>
            <Link to="/login" className="register-link">
              Inicia Sesion aqui
            </Link>
          </div>

        </div>
      </div>
    );
}

export default Register