import axios from "axios";

const API_URL = import.meta.env.VITE_API_PATH;

export const itemLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/items`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    params: {
      page,
    },
  });
};

export const itemAll = async (token) => {
  return await axios.get(`${API_URL}/items/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const itemDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/items/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
};

export const itemCreate = async (token, payload) => {
  return await axios.post(
    `${API_URL}/items`,
    payload,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const itemUpdate = async (token, id, formData) => {
  return await axios.post(
    `${API_URL}/items/${id}`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  );
};

export const itemDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/items/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
};

