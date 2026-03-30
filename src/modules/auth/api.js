import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PATH;

// ── Auth ──────────────────────────────────────────────────────────────────────

export const userRegister = async (data) => {
  return await axios.post(`${API_URL}/register`, data, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
};

export const userLogin = async ({ login, password }) => {
  return await axios.post(
    `${API_URL}/login`,
    { login, password },
    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
  );
};

export const userLogout = async (token) => {
  return await axios.delete(`${API_URL}/logout`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
};

export const userResendVerification = async (token) => {
  return await axios.post(
    `${API_URL}/email/verification-notification`,
    {},
    { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
  );
};

// ── User Management ───────────────────────────────────────────────────────────

const authHeaders = (token) => ({
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
});

export const userLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/users`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const userDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/users/${id}`, {
    headers: authHeaders(token),
  });
};

export const userCreate = async (token, payload) => {
  return await axios.post(`${API_URL}/users`, payload, {
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  });
};

export const userUpdate = async (token, id, payload) => {
  return await axios.put(`${API_URL}/users/${id}`, payload, {
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  });
};

export const userDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/users/${id}`, {
    headers: authHeaders(token),
  });
};