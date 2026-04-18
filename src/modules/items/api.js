import { api, authHeaders } from "@/shared/lib/axios";

export const itemLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/items`, {
    headers: authHeaders(token),
    params: {
      page,
    },
  });
};

export const itemAll = async (token) => {
  return await api.get(`/items/all`, {
    headers: authHeaders(token),
  });
};

export const itemDetail = async (token, { id }) => {
  return await api.get(`/items/${id}`, {
    headers: authHeaders(token),
  });
};

export const itemCreate = async (token, payload) => {
  return await api.post(
    `/items`,
    payload,
    {
      headers: authHeaders(token),
    }
  );
};

export const itemUpdate = async (token, id, formData) => {
  return await api.put(
    `/items/${id}`,
    formData,
    {
      headers: authHeaders(token),
    }
  );
};

export const itemDelete = async (token, { id }) => {
  return await api.delete(`/items/${id}`, {
    headers: authHeaders(token)
  });
};

