import { api, authHeaders } from "@/shared/lib/axios";

export const fetchSalesSummary = async (token, params) => {
  return await api.get(`/reports/sales-summary`, {
    headers: authHeaders(token),
    params,
  });
};

export const fetchSalesByItem = async (token, params) => {
  return await api.get(`/reports/sales-by-item`, {
    headers: authHeaders(token),
    params,
  });
};

export const fetchPaymentBreakdown = async (token, params) => {
  return await api.get(`/reports/payment-breakdown`, {
    headers: authHeaders(token),
    params,
  });
};

export const fetchSalesByBranch = async (token, params) => {
  return await api.get(`/reports/sales-by-branch`, {
    headers: authHeaders(token),
    params,
  });
};