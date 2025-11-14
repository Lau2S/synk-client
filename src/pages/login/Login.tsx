import type React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div className="container-page">
            <div className="login-card">
                <h2>Iniciar Sesión</h2>
                <p>Ingresa tus datos para comenzar a usar Synk </p>

                <form className='login-form'>
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
                
                <div className="login-options">
                    <button className='login-button' onClick={handleLoginGoogle} >
                        <img src="icons/google-icon.svg" alt="Iniciar sesión con Google" width={24} height={24} />
                        <span>Google</span>
                    </button>

                    <button className='login-button' onClick={handleLoginGoogle} >
                        <img src="icons/google-icon.svg" alt="Iniciar sesión con Facebook" width={24} height={24} />
                        <span>Facebook</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login