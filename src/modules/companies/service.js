import * as api from './api';
import { extractData, extractPaginated } from '@/lib/apiService';

export const companyService = {
  async getPaginated(token, page = 1) {
    const response = await api.companyLists(token, { page });
    return extractPaginated(response);
  },

  async getById(token, id) {
    const response = await api.companyDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload) {
    const response = await api.companyCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.companyUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.companyDelete(token, { id });
  },
};