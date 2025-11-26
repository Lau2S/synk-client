import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component - Wrapper for authenticated routes.
 * 
 * Prevents access to protected pages unless user is authenticated.
 * Shows loading state while checking authentication status.
 * Redirects to login page with return URL if user is not authenticated.
 * 
 * @param {React.ReactNode} children - The protected component to render
 * @returns {JSX.Element} The protected content or redirect to login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, initAuthObserver } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initialize auth observer to check authentication state
    if (initAuthObserver) {
      const unsubscribe = initAuthObserver();
      
      // Give some time for auth to initialize
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => {
        if (unsubscribe) unsubscribe();
        clearTimeout(timer);
      };
    } else {
      setLoading(false);
    }
  }, [initAuthObserver]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(600px at 10% 20%, rgba(62, 199, 205, 0.15), transparent), radial-gradient(800px at 90% 80%, rgba(62, 199, 205, 0.12), transparent), #1b2226',
        color: '#fff'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(62, 199, 205, 0.3)',
          borderTop: '3px solid #3ec7cd',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ fontSize: '1.1rem', color: '#a8c4c5' }}>Verificando autenticación...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    // Check Firebase user
    if (user) return true;
    
    // Check localStorage token as fallback
    const token = localStorage.getItem('token');
    if (token) return true;
    
    return false;
  };

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated()) {
    return (
      <Navigate 
        to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;