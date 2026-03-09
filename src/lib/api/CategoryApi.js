import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PATH;

const authHeaders = (token) => ({
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
});

export const categoryLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/categories`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const categoryAll = async (token) => {
  return await axios.get(`${API_URL}/categories/all`, {
    headers: authHeaders(token),
  });
};

export const categoryDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/categories/${id}`, {
    headers: authHeaders(token),
  });
};

export const categoryCreate = async (token, payload) => {
  return await axios.post(`${API_URL}/categories`, payload, {
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  });
};

export const categoryUpdate = async (token, id, payload) => {
  return await axios.put(`${API_URL}/categories/${id}`, payload, {
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  });
};

export const categoryDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/categories/${id}`, {
    headers: authHeaders(token),
  });
};