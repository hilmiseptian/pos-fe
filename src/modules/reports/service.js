import * as api from "./api";
import { extractData } from "@/lib/apiService";

export const reportService = {
  async getSalesSummary(token, filters) {
    const response = await api.fetchSalesSummary(token, filters);
    return extractData(response);
  },

  async getSalesByItem(token, filters) {
    const response = await api.fetchSalesByItem(token, filters);
    return extractData(response);
  },

  async getPaymentBreakdown(token, filters) {
    const response = await api.fetchPaymentBreakdown(token, filters);
    return extractData(response);
  },

  async getSalesByBranch(token, filters) {
    const response = await api.fetchSalesByBranch(token, filters);
    return extractData(response);
  },
};