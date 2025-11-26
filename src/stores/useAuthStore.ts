import { create } from 'zustand'
import { signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { auth, googleProvider, facebookProvider } from '../lib/firebase.config';



interface User {
    displayName: string | null,
    email: string | null,
    photoURL: string | null,
}

type AuthStore = {
   user: User | null,
   setUser: (user: User) => void,
   initAuthObserver: () => () => void,
   loginWithGoogle: () => Promise<void>,
    loginWithFacebook: () => Promise<void>,
   logout: () => Promise<void>,
   resetPassword?: (email: string) => Promise<void>,
}

/**
 * Lightweight user representation stored in the auth store.
 *
 * @typedef {Object} User
 * @property {string|null} displayName - Display name from Firebase.
 * @property {string|null} email - Email address.
 * @property {string|null} photoURL - Photo URL.
 */

/**
 * AuthStore shape.
 *
 * - user: current authenticated user or null.
 * - setUser(user): replace the local user object.
 * - initAuthObserver(): attach Firebase auth observer, returns unsubscribe fn.
 * - loginWithGoogle(): open Google popup sign-in.
 * - logout(): sign out the current Firebase user.
 * - resetPassword(email): send a password reset email (may be optional).
 *
 * @typedef {Object} AuthStore
 * @property {User|null} user
 * @property {(user: User) => void} setUser
 * @property {() => () => void} initAuthObserver
 * @property {() => Promise<void>} loginWithGoogle
 * @property {() => Promise<void>} logout
 * @property {(email: string) => Promise<void>} [resetPassword]
 */

/**
 * Zustand auth store managing Firebase authentication state and helpers.
 *
 * The store keeps a minimal user object and exposes helper actions:
 * - initAuthObserver: subscribes to Firebase `onAuthStateChanged` and updates the store.
 * - loginWithGoogle: triggers sign-in with a popup using googleProvider.
 * - logout: calls Firebase signOut.
 * - resetPassword: wrapper around Firebase sendPasswordResetEmail (rethrows on error).
 *
 * This store does not perform routing or side effects beyond Firebase calls;
 * components should handle navigation and localStorage token persistence.
 */

const useAuthStore = create<AuthStore>()((set) => ({
    user: null,

    /**
     * Replace the stored user object.
     * @param {User} user
     */

    setUser: (user: User) => set({ user }),

    /**
     * Initialize Firebase auth observer.
     *
     * Attaches onAuthStateChanged and maps the Firebase user to the store's
     * User shape. Returns the unsubscribe function so callers can clean up.
     *
     * @returns {() => void} unsubscribe function
     */

    initAuthObserver: () => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (fbUser) => {
                if (fbUser) {
                    const userLogged: User = {
                        displayName: fbUser.displayName,
                        email: fbUser.email,
                        photoURL: fbUser.photoURL,
                    };
                    set ({ user: userLogged });
                } else {
                    set ({ user: null });
                }
            },
            (err) => {
                console.error(err);
            }
        );
        return unsubscribe;
    },

    /**
     * Sign-in using Google popup.
     *
     * Errors are caught and logged; callers can extend behavior if needed.
     */

    loginWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          
          // 🔴 IMPORTANTE: obtener idToken y enviarlo al backend
          const idToken = await result.user.getIdToken();
          
          // Enviar al backend para guardar en Firestore
          const response = await fetch('http://localhost:3000/api/v1/users/social-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
    
          const data = await response.json();
          
          if (response.ok) {
            // Guardar token y usuario en el store
            localStorage.setItem('token', idToken);
            set({ user: data.user });
            return data.user;
          } else {
            throw new Error(data.message || 'Error en login social');
          }
        } catch (error: any) {
          console.error('Google login error:', error);
          throw error;
        }
      },

      loginWithFacebook: async () => {
        try {
          const provider = new FacebookAuthProvider();
          const result = await signInWithPopup(auth, provider);
          
          const idToken = await result.user.getIdToken();
          
          const response = await fetch('http://localhost:3000/api/v1/users/social-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
    
          const data = await response.json();
          
          if (response.ok) {
            localStorage.setItem('token', idToken);
            set({ user: data.user });
            return data.user;
          } else {
            throw new Error(data.message || 'Error en login social');
          }
        } catch (error: any) {
          console.error('Facebook login error:', error);
          throw error;
        }
      },

    /**
     * Sign out the current Firebase user.
     */

    logout: async () => {
        try {
            await signOut(auth);
        } catch (e: any) {
            console.error(e);
        }
    },

    /**
     * Send a password reset email via Firebase.
     *
     * Rethrows the error so callers can display feedback.
     *
     * @param {string} email
     */

    resetPassword: async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (e: any) {
            console.error('resetPassword error:', e);
            throw e;
        }
    }
    
}))

export default useAuthStore;
