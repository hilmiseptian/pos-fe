import { api, authHeaders } from "@/shared/lib/axios";

export const userRegister = async (data) => {
  return await api.post(`/register`, data, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
};

export const userLogin = async ({ login, password }) => {
  return await api.post(
    `/login`,
    { login, password },
    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
  );
};

export const userLogout = async (token) => {
  return await api.delete(`/logout`, {
    headers: authHeaders(token),
  });
};

export const userResendVerification = async (token) => {
  return await api.post(
    `/email/verification-notification`,
    {},
    { headers: authHeaders(token) }
  );
};
