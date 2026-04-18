import { api, authHeaders } from "@/shared/lib/axios";

export const branchLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/branches`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const branchDetail = async (token, { id }) => {
  return await api.get(`/branches/${id}`, {
    headers: authHeaders(token),
  });
};

export const branchCreate = async (token, payload) => {
  return await api.post(`/branches`, payload, {
    headers: authHeaders(token),
  });
};

export const branchUpdate = async (token, id, formData) => {
  return await api.put(`/branches/${id}`, formData, {
    headers: authHeaders(token),
  });
};

export const branchDelete = async (token, { id }) => {
  return await api.delete(`/branches/${id}`, {
    headers: authHeaders(token),
  });
};
