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
            await signInWithPopup(auth, googleProvider);
        } catch (e: any) {
            console.error(e);
        }
    },

    loginWithFacebook: async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
        } catch (e: any) {
            console.error(e);
        }
    },

    /**
     * Sign out the current Firebase user and clear all local data.
     */

    logout: async () => {
        try {
            // Limpiar Firebase
            await signOut(auth);
            
            // Limpiar localStorage
            localStorage.removeItem('token');
            
            // Limpiar estado local
            set({ user: null });
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