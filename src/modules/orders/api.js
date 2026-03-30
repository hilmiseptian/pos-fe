import axios from "axios";

const API_URL = import.meta.env.VITE_API_PATH;

// ── Orders Head ────────────────────────────────────────────────────────────────

export const orderLists = async (token, { page = 1 } = {}) => {
  return await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    params: { page },
  });
};

export const orderOpenLists = async (token) => {
  return await axios.get(`${API_URL}/orders/open`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const orderDetail = async (token, { id }) => {
  return await axios.get(`${API_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const orderCreate = async (token, payload = {}) => {
  return await axios.post(
    `${API_URL}/orders`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const orderCancel = async (token, { id }) => {
  return await axios.patch(
    `${API_URL}/orders/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

// ── Order Details (Items) ──────────────────────────────────────────────────────

export const orderAddItem = async (token, { id }, payload) => {
  return await axios.post(
    `${API_URL}/orders/${id}/items`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const orderUpdateItem = async (token, { id, detailId }, payload) => {
  return await axios.put(
    `${API_URL}/orders/${id}/items/${detailId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};

export const orderRemoveItem = async (token, { id, detailId }) => {
  return await axios.delete(`${API_URL}/orders/${id}/items/${detailId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

// ── Order Payment ──────────────────────────────────────────────────────────────

export const orderProcessPayment = async (token, { id }, payload) => {
  return await axios.post(
    `${API_URL}/orders/${id}/payment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
};