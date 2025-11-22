
import axios from "axios";
import { getAuth } from "firebase/auth";

/**
 * API base URL.
 * Reads from environment variable VITE_API_URL, falls back to '/api' when not set.
 * @type {string}
 */

const baseURL = import.meta.env.VITE_API_URL ?? "/api";
console.log("API baseURL:", baseURL);

/**
 * Preconfigured Axios instance for the application's API.
 *
 * - baseURL is taken from VITE_API_URL or '/api'
 * - Content-Type header is set to application/json
 * - timeout set to 12000ms
 *
 * @type {import("axios").AxiosInstance}
 */

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 12000,
});

/**
 * Axios request interceptor that attempts to attach an Authorization header.
 *
 * Behavior:
 * 1. Try to obtain a Firebase ID token from the Firebase client SDK:
 *    - getAuth().currentUser?.getIdToken()
 *    - If successful, sets `Authorization: Bearer <idToken>`
 * 2. If Firebase token is not available or fails, fallback to a token stored
 *    in localStorage under the key 'token' (backend-issued token).
 *
 * Notes:
 * - The function is async because getIdToken() returns a promise.
 * - Headers are mutated on the provided config when available.
 *
 * @param {import("axios").AxiosRequestConfig} config - Axios request config to modify.
 * @returns {Promise<import("axios").AxiosRequestConfig>} The modified request config.
 */

api.interceptors.request.use(async (config) => {
  try {
    // first try Firebase client SDK token
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

  // fallback: token saved by loginUser (backend token)
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
