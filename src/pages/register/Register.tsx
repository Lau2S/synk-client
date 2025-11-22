import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import './Register.scss';
import { createUser } from '../../api/users';
import { registerUser } from '../../api/users';

/**
 * Register page component.
 *
 * Provides a registration form (name, last name, age, email, password) and
 * social sign-up via Google/Facebook. On successful registration the user is
 * redirected to the login page.
 *
 * Uses the auth store's initAuthObserver to initialize auth state if available.
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} Registration page markup and behavior.
 */

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, initAuthObserver } = useAuthStore();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize authentication observer on mount if provided by the auth store.
   * The observer cleanup is returned to the effect cleanup.
   */

  useEffect(() => {
    if (!initAuthObserver) return;
    const unsub = initAuthObserver();
    return () => unsub?.();
  }, [initAuthObserver]);

  /**
   * Trigger Google (or social) sign-up flow and navigate to profile on success.
   *
   * @param {React.FormEvent} e - Event from the social button click.
   * @returns {void}
   */

  const handleLoginGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle().then(() => navigate('/profile'));
  };

  /**
   * Handle registration form submit.
   *
   * - Validates required fields and password confirmation.
   * - Builds payload matching backend expected shape.
   * - Calls registerUser (public register endpoint) and navigates to /login on success.
   *
   * @param {React.FormEvent} e - Form submit event.
   * @async
   * @returns {Promise<void>}
   */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Completa los campos requeridos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      // payload acorde al backend
      const payload = {
        firstName: name,
        lastName: lastName || undefined,
        email,
        password,
        age: age === '' ? undefined : Number(age)
      };

-      await createUser(payload);
+      await registerUser(payload);

      navigate('/login');
    } catch (err: any) {
      setError(err?.message || err?.response?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-register">
      <div className="register-card">
        <h2>Registrate</h2>
        <p>Crea una cuenta en Synk para acceder a la aplicación </p>

        <form className="register-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="lastName"
              placeholder="Ingresa tu Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              id="edad"
              placeholder="Ingresa tu Edad"
              value={age === '' ? '' : String(age)}
              onChange={(e) =>
                setAge(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="form-input"
            />
          </div>

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

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirma tu Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="separator"><span>o</span></div>

        <div className="register-options">
          <button
            className="google-register-button"
            onClick={handleLoginGoogle}
            type="button"
          >
            <img src="logos/google-logo.png" alt="Registrarse con Google" />
            <span>Usa Google</span>
          </button>

          <button
            className="facebook-register-button"
            onClick={handleLoginGoogle}
            type="button"
          >
            <img src="logos/facebook-logo.png" alt="Registrarse con Facebook" />
            <span>Usa Facebook</span>
          </button>
        </div>

        <div className="register-prompt">
          <span>¿Ya tienes una cuenta? </span>
          <Link to="/login" className="register-link">Inicia Sesion aqui</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
