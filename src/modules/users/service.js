import * as api from './api';
import { extractData, extractPaginated } from '@/lib/apiService';

export const userService = {
  async getPaginated(token, page = 1) {
    const response = await api.userLists(token, { page });
    return extractPaginated(response);
  },

  async getById(token, id) {
    const response = await api.userDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload) {
    const response = await api.userCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.userUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.userDelete(token, { id });
  },
};