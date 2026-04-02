import { api, authHeaders } from "@/shared/lib/axios";

export const categoryLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/categories`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const categoryAll = async (token) => {
  return await api.get(`/categories/all`, {
    headers: authHeaders(token),
  });
};

export const categoryDetail = async (token, { id }) => {
  return await api.get(`/categories/${id}`, {
    headers: authHeaders(token),
  });
};

export const categoryCreate = async (token, payload) => {
  return await api.post(`/categories`, payload, {
    headers: authHeaders(token),
  });
};

export const categoryUpdate = async (token, id, payload) => {
  return await api.put(`/categories/${id}`, payload, {
    headers: authHeaders(token),
  });
};

export const categoryDelete = async (token, { id }) => {
  return await api.delete(`/categories/${id}`, {
    headers: authHeaders(token),
  });
};