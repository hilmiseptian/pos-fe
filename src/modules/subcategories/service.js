import * as api from './api';
import { extractData, extractPaginated } from '@/lib/apiService';

export const subCategoryService = {
  async getPaginated(token, page = 1) {
    const response = await api.subCategoryLists(token, { page });
    return extractPaginated(response);
  },

  async getById(token, id) {
    const response = await api.subCategoryDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload) {
    const response = await api.subCategoryCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.subCategoryUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.subCategoryDelete(token, { id });
  },
};