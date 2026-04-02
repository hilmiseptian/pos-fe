import { api, authHeaders } from "@/shared/lib/axios";

export const userLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/users`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const userDetail = async (token, { id }) => {
  return await api.get(`/users/${id}`, {
    headers: authHeaders(token),
  });
};

export const userCreate = async (token, payload) => {
  return await api.post(`/users`, payload, {
    headers: authHeaders(token),
  });
};

export const userUpdate = async (token, id, payload) => {
  return await api.put(`/users/${id}`, payload, {
    headers: authHeaders(token),
  });
};

export const userDelete = async (token, { id }) => {
  return await api.delete(`/users/${id}`, {
    headers: authHeaders(token),
  });
};