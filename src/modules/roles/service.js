import * as api from './api';
import { extractData, extractList, extractPaginated } from '@/lib/apiService';

export const roleService = {
  async getPaginated(token, page = 1) {
    const response = await api.roleLists(token, { page });
    return extractPaginated(response);
  },

  async getAll(token) {
    const response = await api.roleAll(token);
    return extractList(response);
  },

  async getById(token, id) {
    const response = await api.roleDetail(token, { id });
    return extractData(response);
  },

  async getPermissions(token) {
    const response = await api.permissionList(token);
    return extractList(response);
  },

  async create(token, payload) {
    const response = await api.roleCreate(token, payload);
    return extractData(response);
  },

  async update(token, id, payload) {
    const response = await api.roleUpdate(token, id, payload);
    return extractData(response);
  },

  async remove(token, id) {
    await api.roleDelete(token, { id });
  },
};