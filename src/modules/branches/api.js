import axios from "axios";

const API_URL = import.meta.env.VITE_API_PATH;

export const branchLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/branches`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    params: { page },
  });
};

export const branchDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/branches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const branchCreate = async (token, payload) => {
  return await axios.post(`${API_URL}/branches`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const branchUpdate = async (token, id, formData) => {
  return await axios.post(`${API_URL}/branches/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const branchDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/branches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
