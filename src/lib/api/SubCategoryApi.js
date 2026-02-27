import axios from "axios";

const API_URL = import.meta.env.VITE_API_PATH;

export const subCategoryLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/subcategories`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    params: { page },
  });
};

export const subCategoryDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/subcategories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const subCategoryCreate = async (token, payload) => {
  return await axios.post(
    `${API_URL}/subcategories`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const subCategoryUpdate = async (token, id, formData) => {
  return await axios.post(
    `${API_URL}/subcategories/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const subCategoryDelete = async (token, { id }) => {
  return await axios.delete(`${API_URL}/subcategories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};
