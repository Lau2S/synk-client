// ...existing code...
import api from "./api";

export async function getUsers() {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

export async function getUser(id: string) {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

export async function createUser(data: any) {
  try {
    const res = await api.post("/users", data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/** Registro: POST /api/users/register */
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

/** Nuevo: obtener profile del usuario autenticado -> GET /api/users/me */
export async function getMe() {
  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/** Actualizar / eliminar */
export async function updateUser(id: string, data: any) {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/** Login: POST /api/users/login */
export async function loginUser(data: { email?: string; password?: string; idToken?: string }) {
  try {
    const res = await api.post("/users/login", data);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}
