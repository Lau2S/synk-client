import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { useEffect } from 'react';
import './Login.scss';

const Login: React.FC = () => {
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
      <div className="container-login">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus datos para comenzar a usar Synk </p>

          <form className="login-form">
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
          </form>

          <button className="login-button">Iniciar Sesión</button>

          <div className="separator">
            <span>o</span>
          </div>

          <div className="login-options">
            <button className="google-login-button" onClick={handleLoginGoogle}>
              <img
                src="logos/google-logo.png"
                alt="Iniciar sesión con Google"
              />
              <span>Usa Google</span>
            </button>

            <button
              className="facebook-login-button"
              onClick={handleLoginGoogle}
            >
              <img
                src="logos/facebook-logo.png"
                alt="Iniciar sesión con Facebook"
              />
              <span>Usa Facebook</span>
            </button>
          </div>

          <div className="login-prompt">
            <span>¿Primera vez en Synk? </span>
            <Link to="/register" className="login-link">
              Registrate aqui
            </Link>
          </div>

        </div>
      </div>
    );
}

export default Login