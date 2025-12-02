import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../lib/firebase.config';
import './ResetPassword.scss';

/**
 * ResetPassword page component.
 *
 * Handles password reset confirmation using Firebase. Requires an 'oobCode' 
 * query parameter from the Firebase password reset email link.
 *
 * Flow:
 * 1. Extract oobCode from URL query parameters
 * 2. Allow user to enter new password and confirmation
 * 3. Call Firebase confirmPasswordReset with the code and new password
 * 4. Navigate to login on success
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} Reset password page markup and behavior.
 */

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const newPassRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  // Extract the oobCode from URL parameters
  const oobCode = searchParams.get('oobCode');

  /**
   * Validate that we have the required oobCode parameter on mount.
   * Redirect to login if missing.
   */
  useEffect(() => {
    if (!oobCode) {
      setError('Enlace de recuperación inválido o expirado.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [oobCode, navigate]);

  /**
   * Handle password reset form submission.
   *
   * Validates password confirmation, then calls Firebase confirmPasswordReset
   * with the oobCode and new password.
   *
   * @param {React.FormEvent} e - Form submit event.
   * @returns {Promise<void>}
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!oobCode) {
      setError('Código de recuperación no válido.');
      return;
    }

    setLoading(true);

    try {
      // Firebase function to confirm password reset
      await confirmPasswordReset(auth, oobCode, newPassword);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Password reset error:', err);
      
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/expired-action-code':
          setError('El enlace de recuperación ha expirado. Solicita uno nuevo.');
          break;
        case 'auth/invalid-action-code':
          setError('El enlace de recuperación no es válido.');
          break;
        case 'auth/weak-password':
          setError('La contraseña es muy débil. Usa al menos 6 caracteres.');
          break;
        default:
          setError('Error al restablecer la contraseña. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show success message
  if (success) {
    return (
      <div className="container-reset-password">
        <div className="reset-card">
          <div className="success-icon">✓</div>
          <h2>¡Contraseña Actualizada!</h2>
          <p>Tu contraseña ha sido cambiada exitosamente.</p>
          <p>Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-reset-password">
      <div className="reset-card">
        <h2>Restablecer Contraseña</h2>
        <p>Ingresa tu nueva contraseña</p>

        <form className="reset-form" onSubmit={handleResetPassword}>
          <div className="form-group">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-input"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              minLength={6}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button 
            type="submit" 
            className="reset-button" 
            disabled={loading || !oobCode}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

        <div className="back-to-login">
          <button 
            type="button" 
            className="back-link" 
            onClick={() => navigate('/login')}
          >
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;