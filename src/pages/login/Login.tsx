import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { useEffect, useState } from 'react';
import './Login.scss';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, initAuthObserver, resetPassword } = useAuthStore();

    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');

    const handleSendReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!resetEmail) return;
      setSending(true);
      setInfoMessage('');
      // Si useAuthStore no tiene resetPassword, se simula la acción
      const action = resetPassword ?? (async (_email: string) => Promise.resolve());
      try {
        await action(resetEmail);
        setInfoMessage('Se envió el enlace de recuperación. Revisa tu correo.');
        setTimeout(() => {
          setShowReset(false);
          setResetEmail('');
          setInfoMessage('');
        }, 1800);
      } catch (err) {
        setInfoMessage('No se pudo enviar el enlace. Intenta de nuevo.');
      } finally {
        setSending(false);
      }
    };

    const handleLoginGoogle = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        loginWithGoogle().then(() => navigate('/profile'));
    }

    useEffect(() => {
        if (!initAuthObserver) return;
        const unsub = initAuthObserver();
        return () => unsub?.();
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
            <div className="forgot-row">
              <button
                type="button"
                className="forgot-link"
                onClick={() => setShowReset(true)}
              >
                Olvidé mi contraseña
              </button>
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
        {showReset && (
          <div className="password-reset-modal" role="dialog" aria-modal="true" aria-label="Recuperar Contraseña">
            <div className="modal-overlay" onClick={() => setShowReset(false)} />
            <div className="modal-content">
              <button className="modal-close-btn" onClick={() => setShowReset(false)}>✕</button>
              <h2 className="modal-title">Recuperar Contraseña</h2>
              <p className="modal-subtitle">Ingresa tu Email para enviar enlace de recuperación</p>

              <form className="reset-form" onSubmit={handleSendReset}>
                <input
                  className="reset-input"
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />

                <button type="submit" className="reset-send-btn">{sending ? 'Enviando...' : 'Enviar'}</button>
                <button type="button" className="reset-cancel-btn" onClick={() => { setShowReset(false); setResetEmail(''); }}>Cancelar</button>

                {infoMessage && <div className="reset-info">{infoMessage}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    );
}

export default Login