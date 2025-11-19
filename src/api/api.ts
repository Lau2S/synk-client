
import axios from "axios";
import { getAuth } from "firebase/auth";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";
console.log("API baseURL:", baseURL);

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 12000,
});

// Interceptor: añade Authorization si hay usuario autenticado (Firebase client)
// o token guardado en localStorage (backend-issued token)
api.interceptors.request.use(async (config) => {
  try {
    // primero intenta token de Firebase client SDK
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      if (idToken && config.headers) {
        config.headers.Authorization = `Bearer ${idToken}`;
        return config;
      }
    }
  } catch (e) {
    // ignore firebase errors y fallback
  }

  // fallback: token guardado por loginUser (backend token)
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }

  return config;
}, (err) => Promise.reject(err));

export default api;
