import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PATH;

// ── Auth ──────────────────────────────────────────────────────────────────────

export const userRegister = async (data) => {
  return await axios.post(`${API_URL}/register`, data, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const userLogin = async ({ email, password }) => {
  return await axios.post(
    `${API_URL}/login`,
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
};

export const userLogout = async (token) => {
  return await axios.delete(`${API_URL}/logout`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const userResendVerification = async (token) => {
  return await axios.post(
    `${API_URL}/email/verification-notification`,
    {},
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const getUsers = async (token) => {
  return await axios.get(`${API_URL}/users`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserById = async (token, id) => {
  return await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};