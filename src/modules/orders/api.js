import { api, authHeaders } from "@/shared/lib/axios";

export const orderLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/orders`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const orderOpenLists = async (token) => {
  return await api.get(`/orders/open`, {
    headers: authHeaders(token),
  });
};

export const orderDetail = async (token, { id }) => {
  return await api.get(`/orders/${id}`, {
    headers: authHeaders(token),
  });
};

export const orderCreate = async (token, payload = {}) => {
  return await api.post(
    `/orders`,
    payload,
    {
      headers: authHeaders(token),
    }
  );
};

export const orderCancel = async (token, { id }) => {
  return await api.patch(
    `/orders/${id}/cancel`,
    {},
    {
      headers: authHeaders(token),
    }
  );
};

// ── Order Details (Items) ──────────────────────────────────────────────────────

export const orderAddItem = async (token, { id }, payload) => {
  return await api.post(
    `/orders/${id}/items`,
    payload,
    {
      headers: authHeaders(token),
    }
  );
};

export const orderUpdateItem = async (token, { id, detailId }, payload) => {
  return await api.put(
    `/orders/${id}/items/${detailId}`,
    payload,
    {
      headers: authHeaders(token),
    }
  );
};

export const orderRemoveItem = async (token, { id, detailId }) => {
  return await api.delete(`/orders/${id}/items/${detailId}`, {
    headers: authHeaders(token),
  });
};

// ── Order Payment ──────────────────────────────────────────────────────────────

export const orderProcessPayment = async (token, { id }, payload) => {
  return await api.post(
    `/orders/${id}/payment`,
    payload,
    {
      headers: authHeaders(token),
    }
  );
};