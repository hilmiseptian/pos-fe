import axios from "axios";

const API_URL = import.meta.env.VITE_API_PATH;

export const categoryLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    params: { page },
  });
};

export const categoryDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const categoryCreate = async (token, payload) => {
  return await axios.post(
    `${API_URL}/categories`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const categoryUpdate = async (token, id, formData) => {
  return await axios.post(
    `${API_URL}/categories/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const categoryDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};
