import * as api from "./api";
import { extractData } from "@/lib/apiService";

export const dashboardService = {
  async getSummary(token) {
    const response = await api.fetchDashboardSummary(token);
    return extractData(response);
  },
};