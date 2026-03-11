import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PATH;

const authHeaders = (token) => ({
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
});

// ── Permissions ────────────────────────────────────────────────────────────────

export const permissionList = async (token) => {
  return await axios.get(`${API_URL}/permissions`, {
    headers: authHeaders(token),
  });
};

// ── Roles ──────────────────────────────────────────────────────────────────────

export const roleLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/roles`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const roleAll = async (token) => {
  return await axios.get(`${API_URL}/roles/all`, {
    headers: authHeaders(token),
  });
};

export const roleDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/roles/${id}`, {
    headers: authHeaders(token),
  });
};

export const roleCreate = async (token, payload) => {
  return await axios.post(`${API_URL}/roles`, payload, {
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  });
};

export const roleUpdate = async (token, id, payload) => {
  return await axios.put(`${API_URL}/roles/${id}`, payload, {
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  });
};

export const roleDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/roles/${id}`, {
    headers: authHeaders(token),
  });
};