// ...existing code...
import api from "./api";

/**
 * Users module - API wrappers for user-related endpoints.
 *
 * Each function returns the backend response data or throws the backend
 * error payload when the request fails.
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} firstName
 * @property {string} [lastName]
 * @property {string} email
 * @property {number} [age]
 * @property {string} [photo]
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} firstName
 * @property {string} [lastName]
 * @property {string} email
 * @property {string} password
 * @property {number} [age]
 * @property {string} [photo]
 */

/**
 * @typedef {Object} LoginData
 * @property {string} [email]
 * @property {string} [password]
 * @property {string} [idToken]
 */

/**
 * Fetch all users.
 *
 * @returns {Promise<any>} Resolves with the server response data (often an array of User).
 * @throws The backend error payload or the original error.
 */

export async function getUsers() {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Fetch a single user by ID.
 *
 * @param {string} id - User ID.
 * @returns {Promise<any>} Resolves with the server response data (User).
 * @throws The backend error payload or the original error.
 */

export async function getUser(id: string) {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Create a new user.
 *
 * @param {any} data - Payload for creating the user.
 * @returns {Promise<any>} Resolves with the created user data.
 * @throws The backend error payload or the original error.
 */

export async function createUser(data: any) {
  try {
    const res = await api.post("/users", data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Register a new user (public endpoint).
 *
 * POST /api/users/register
 *
 * @param {RegisterData} data - Registration payload.
 * @returns {Promise<any>} Resolves with the server response (created user / token).
 * @throws The backend error payload or the original error.
 */

export async function registerUser(data: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  photo?: string;
}) {
  try {
    const res = await api.post("/users/register", data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Get profile of the authenticated user.
 *
 * GET /api/users/me
 *
 * @returns {Promise<any>} Resolves with the authenticated user's profile.
 * @throws The backend error payload or the original error.
 */

export async function getMe() {
  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Update a user by ID.
 *
 * @param {string} id - User ID to update.
 * @param {any} data - Partial or full user payload to update.
 * @returns {Promise<any>} Resolves with the updated user data.
 * @throws The backend error payload or the original error.
 */

export async function updateUser(id: string, data: any) {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Delete a user by ID.
 *
 * @param {string} id - User ID to delete.
 * @returns {Promise<any>} Resolves with the server response.
 * @throws The backend error payload or the original error.
 */

export async function deleteUser(id: string) {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Login user. Supports backend email/password login or Firebase idToken exchange.
 *
 * POST /api/users/login
 *
 * @param {LoginData} data - Login payload, may include email/password or idToken.
 * @returns {Promise<any>} Resolves with auth data (token, user, etc.).
 * @throws The backend error payload or the original error.
 */

export async function loginUser(data: { email?: string; password?: string; idToken?: string }) {
  try {
    const res = await api.post("/users/login", data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}
