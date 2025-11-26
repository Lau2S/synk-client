import axios from "axios";
import { getAuth } from "firebase/auth";

/**
 * Meet API base URL.
 * Reads from environment variable VITE_MEET_URL
 */
const meetBaseURL = import.meta.env.VITE_MEET_URL ?? "http://localhost:4000";
console.log("Meet API baseURL:", meetBaseURL);

/**
 * Axios instance for Meet service API.
 */
const meetApi = axios.create({
  baseURL: meetBaseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 12000,
});

/**
 * Request interceptor to attach Authorization header.
 */
meetApi.interceptors.request.use(async (config) => {
  try {
    // Try Firebase client SDK token first
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
    // Ignore firebase errors and fallback
  }

  // Fallback: token saved by loginUser (backend token)
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore
  }

  return config;
}, (err) => Promise.reject(err));

export default meetApi;