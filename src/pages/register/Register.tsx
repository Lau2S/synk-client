import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import './Register.scss';
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
  const [searchParams] = useSearchParams();
  const { initAuthObserver, user } = useAuthStore();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  /**
   * Initialize authentication observer on mount if provided by the auth store.
   * The observer cleanup is returned to the effect cleanup.
   */

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

  useEffect(() => {
    if (!initAuthObserver) return;
    const unsub = initAuthObserver();
    return () => unsub?.();
  }, [initAuthObserver]);

  /**
   * Validate password requirements in real-time.
   *
   * @param {string} pass - The password to validate.
   */
  const validatePassword = (pass: string) => {
    setPasswordValidation({
      minLength: pass.length >= 8,
      hasUpperCase: /[A-Z]/.test(pass),
      hasLowerCase: /[a-z]/.test(pass),
      hasNumber: /\d/.test(pass),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
    });
  };

  /**
   * Handle password input change with validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    // Re-validate confirm password if it exists
    if (confirmPassword) {
      setPasswordMatch(newPassword === confirmPassword);
    }
  };

  /**
   * Handle confirm password input change with validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    // Only validate if both fields have content
    if (password && newConfirmPassword) {
      setPasswordMatch(password === newConfirmPassword);
    } else {
      setPasswordMatch(null);
    }
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

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Ingresa tu Contraseña"
              value={password}
              onChange={handlePasswordChange}
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
            {password && (
              <div className="password-requirements">
                <p>La contraseña debe contener:</p>
                <ul>
                  <li className={passwordValidation.minLength ? "valid" : ""}>
                    <span className="icon">{passwordValidation.minLength ? '✓' : '✗'}</span>
                    Al menos 8 caracteres
                  </li>
                  <li className={passwordValidation.hasUpperCase ? "valid" : ""}>
                    <span className="icon">{passwordValidation.hasUpperCase ? '✓' : '✗'}</span>
                    Una letra mayúscula
                  </li>
                  <li className={passwordValidation.hasLowerCase ? "valid" : ""}>
                    <span className="icon">{passwordValidation.hasLowerCase ? '✓' : '✗'}</span>
                    Una letra minúscula
                  </li>
                  <li className={passwordValidation.hasNumber ? "valid" : ""}>
                    <span className="icon">{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                    Un número
                  </li>
                  <li className={passwordValidation.hasSpecialChar ? "valid" : ""}>
                    <span className="icon">{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                    Un carácter especial (!@#$%^&*...)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirma tu Contraseña"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="form-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img 
                src={showConfirmPassword ? "/eye-crossed.svg" : "/eye.svg"} 
                alt={showConfirmPassword ? "Ocultar" : "Mostrar"} 
                className="toggle-icon"
              />
            </button>
            {confirmPassword && passwordMatch !== null && (
              <div className="password-match-validation">
                <div className={`match-indicator ${passwordMatch ? 'valid' : 'invalid'}`}>
                  <span className="icon">{passwordMatch ? '✓' : '✗'}</span>
                  <span className="text">
                    {passwordMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="register-prompt">
          <span>¿Ya tienes una cuenta? </span>
          <Link to="/login" className="register-link">Inicia Sesion aqui</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
