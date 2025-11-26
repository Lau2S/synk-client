import type React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { useEffect, useState } from 'react';
import './Login.scss';
import { loginUser } from '../../api/users'; // 

/**
 * Login page component.
 *
 * Renders the login form, social login buttons and a password reset modal.
 * Handles:
 * - Email/password login via backend (loginUser).
 * - Google/Facebook login via the auth store's loginWithGoogle.
 * - Password reset flow using resetPassword from the auth store (if provided).
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} The login page markup and behavior.
 */

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, loginWithFacebook, initAuthObserver, resetPassword, setUser, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      if (user || localStorage.getItem('token')) {
        const returnUrl = searchParams.get('returnUrl');
        navigate(returnUrl || '/dashboard', { replace: true });
      }
    };
    checkAuth();
  }, [user, navigate, searchParams]);

  /**
   * Handle form submit for email/password login.
   *
   * Calls backend loginUser, stores returned token in localStorage and updates
   * the auth store's user if available. Navigates to /dashboard on success.
   *
   * @param {React.FormEvent} e - Form submit event.
   * @returns {Promise<void>}
   */

  const handleLogin = async (e: React.FormEvent) => {
   e.preventDefault();
   setError(null);

   if (!email || !password) {
     setError('Ingresa email y contraseña.');
     return;
   }

   setLoading(true);
   try {
     // call backend -> { token, user, ... }
     const res = await loginUser({ email, password });
     // save token returned by backend
     if (res?.token) {
       localStorage.setItem('token', res.token);
     }
     // update user store if function exists
     if (res?.user && typeof setUser === 'function') {
       setUser(res.user);
     }
     
     // Redirect to returnUrl or dashboard
     const returnUrl = searchParams.get('returnUrl');
     navigate(returnUrl || '/dashboard');
   } catch (err: any) {
     setError(err?.message || err?.response?.message || 'Credenciales incorrectas');
   } finally {
     setLoading(false);
   }
 };

  /**
   * Handle sending a password reset request.
   *
   * Uses resetPassword from the auth store when present, otherwise no-op.
   *
   * @param {React.FormEvent} e - Form submit event.
   * @returns {Promise<void>}
   */

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setSending(true);
    setInfoMessage('');
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

  /**
   * Trigger social login (Google / Facebook) via the auth store and navigate
   * to the dashboard on success.
   *
   * @param {React.MouseEvent<HTMLButtonElement>=} e - Click event (optional).
   * @returns {void}
   */

   const handleLoginGoogle = async (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        await loginWithGoogle();
        navigate('/dashboard');
      } catch (err: any) {
        setError(err?.message || 'Error al iniciar sesión con Google');
      } finally {
        setLoading(false);
      }
    };
    
    const handleLoginFacebook = async (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        await loginWithFacebook();
        navigate('/dashboard');
      } catch (err: any) {
        setError(err?.message || 'Error al iniciar sesión con Facebook');
      } finally {
        setLoading(false);
      }
   };


  /**
   * Initialize auth observer on mount if provided by the auth store.
   * Returns the unsubscribe function in the effect cleanup.
   */

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

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Ingresa tu Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img 
                src={showPassword ? "/eye-crossed.svg" : "/eye.svg"} 
                alt={showPassword ? "Ocultar" : "Mostrar"} 
                className="toggle-icon"
              />
            </button>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="forgot-row">
          <button
            type="button"
            className="forgot-link"
            onClick={() => setShowReset(true)}
          >
            Olvidé mi contraseña
          </button>
        </div>

        <div className="separator">
          <span>o</span>
        </div>

        <div className="login-options">
          <button className="google-login-button" onClick={handleLoginGoogle}>
            <img src="logos/google-logo.png" alt="Iniciar sesión con Google" />
            <span>Usa Google</span>
          </button>

          <button
            className="facebook-login-button"
            onClick={handleLoginFacebook}
            type="button"
          >
            <img src="logos/facebook-logo.png" alt="Iniciar sesión con Facebook" />
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

              <button type="submit" className="reset-send-btn">
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
              <button
                type="button"
                className="reset-cancel-btn"
                onClick={() => { setShowReset(false); setResetEmail(''); }}
              >
                Cancelar
              </button>

              {infoMessage && <div className="reset-info">{infoMessage}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
