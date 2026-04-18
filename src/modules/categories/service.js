import * as api from './api';
import { extractData, extractList, extractPaginated } from '@/lib/apiService';

export const categoryService = {
  async getPaginated(token, page = 1) {
    const response = await api.categoryLists(token, { page });
    return extractPaginated(response);
  },

  async getAll(token) {
    const response = await api.categoryAll(token);
    return extractList(response);
  },

  async getById(token, id) {
    const response = await api.categoryDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload) {
    const response = await api.categoryCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.categoryUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.categoryDelete(token, { id });
  },
};