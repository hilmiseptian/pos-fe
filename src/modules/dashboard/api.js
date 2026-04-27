import { api, authHeaders } from "@/shared/lib/axios";

export const fetchDashboardSummary = async (token) => {
  return await api.get(`/dashboard/summary`, {
    headers: authHeaders(token),
  });
};