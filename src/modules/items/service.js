import * as api from './api';
import { extractData, extractList, extractPaginated } from '@/lib/apiService';

export const itemService = {
  async getPaginated(token, page = 1) {
    const response = await api.itemLists(token, { page });
    return extractPaginated(response);
  },

  async getAll(token) {
    const response = await api.itemAll(token);
    return extractList(response);
  },

  async getById(token, id) {
    const response = await api.itemDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload) {
    const response = await api.itemCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.itemUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.itemDelete(token, { id });
  },
};