import axios from "axios";

const API_URL = import.meta.env.VITE_API_PATH;

export const companyLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    params: { page },
  });
};

export const companyDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/companies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const companyCreate = async (token, payload) => {
  return await axios.post(`${API_URL}/companies`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const companyUpdate = async (token, id, formData) => {
  return await axios.post(`${API_URL}/companies/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const companyDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/companies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
