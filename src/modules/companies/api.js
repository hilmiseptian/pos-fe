import { api, authHeaders } from "@/shared/lib/axios";

export const companyLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/companies`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const companyDetail = async (token, { id }) => {
  return await api.get(`/companies/${id}`, {
    headers: authHeaders(token),
  });
};

export const companyCreate = async (token, payload) => {
  return await api.post(`/companies`, payload, {
    headers: authHeaders(token),
  });
};

export const companyUpdate = async (token, id, formData) => {
  return await api.post(`/companies/${id}`, formData, {
    headers: authHeaders(token),
  });
};

export const companyDelete = async (token, { id }) => {
  return await api.delete(`/companies/${id}`, {
    headers: authHeaders(token),
  });
};
