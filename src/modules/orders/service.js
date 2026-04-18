import * as api from './api';
import { extractData, extractList, extractPaginated } from '@/lib/apiService';

export const orderService = {
  async getPaginated(token, page = 1) {
    const response = await api.orderLists(token, { page });
    return extractPaginated(response);
  },

  async getOpen(token) {
    const response = await api.orderOpenLists(token);
    return extractList(response);
  },

  async getById(token, id) {
    const response = await api.orderDetail(token, { id });
    return extractData(response);
  },

  async create(token, payload = {}) {
    const response = await api.orderCreate(token, payload);
    return extractData(response);
  },

  async cancel(token, id) {
    const response = await api.orderCancel(token, { id });
    return extractData(response);
  },

  async addItem(token, orderId, payload) {
    const response = await api.orderAddItem(token, { id: orderId }, payload);
    return extractData(response);
  },

  async updateItem(token, orderId, detailId, payload) {
    const response = await api.orderUpdateItem(token, { id: orderId, detailId }, payload);
    return extractData(response);
  },

  async removeItem(token, orderId, detailId) {
    await api.orderRemoveItem(token, { id: orderId, detailId });
  },

  async processPayment(token, orderId, payload) {
    const response = await api.orderProcessPayment(token, { id: orderId }, payload);
    return extractData(response);
  },
};