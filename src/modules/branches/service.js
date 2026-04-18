import * as api from './api';
import { extractData, extractList, extractPaginated } from '@/lib/apiService';

export const branchService = {
  async getPaginated(token, page = 1) {
    const response = await api.branchLists(token, { page });
    return extractPaginated(response);
  },

  async getAll(token) {
    const response = await api.branchLists(token);
    return extractList(response);
  },

  async getById(token, id) {
    const response = await api.branchDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload) {
    const response = await api.branchCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.branchUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.branchDelete(token, { id });
  },
};