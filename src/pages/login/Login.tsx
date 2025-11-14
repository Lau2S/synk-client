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
                <div>
                    <button className='login-button' onClick={handleLoginGoogle} >
                        <img src="icons/google-icon.svg" alt="Iniciar sesión con Google" width={24} height={24} />
                        <span>Google</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login