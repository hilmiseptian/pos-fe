
// ── Permissions ────────────────────────────────────────────────────────────────

import { api, authHeaders } from "@/shared/lib/axios";

export const permissionList = async (token) => {
  return await api.get(`/permissions`, {
    headers: authHeaders(token),
  });
};

// ── Roles ──────────────────────────────────────────────────────────────────────

export const roleLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/roles`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const roleAll = async (token) => {
  return await api.get(`/roles/all`, {
    headers: authHeaders(token),
  });
};

export const roleDetail = async (token, { id }) => {
  return await api.get(`/roles/${id}`, {
    headers: authHeaders(token),
  });
};

export const roleCreate = async (token, payload) => {
  return await api.post(`/roles`, payload, {
    headers: authHeaders(token),
  });
};

export const roleUpdate = async (token, id, payload) => {
  return await api.put(`/roles/${id}`, payload, {
    headers: authHeaders(token),
  });
};

export const roleDelete = async (token, { id }) => {
  return await api.delete(`/roles/${id}`, {
    headers: authHeaders(token),
  });
};