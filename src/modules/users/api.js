import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PATH;

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