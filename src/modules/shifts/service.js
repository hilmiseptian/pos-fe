import * as api from './api';
import { extractData, extractList } from '@/lib/apiService';

export const shiftService = {
  async getActive(token, branchId) {
    const res = await api.shiftActive(token, branchId);
    return res.data.data ?? null;
  },
  async getToday(token, branchId) {
    const res = await api.shiftToday(token, branchId);
    return extractList(res);
  },
  async open(token, branchId) {
    const res = await api.shiftOpen(token, branchId);
    return extractData(res);
  },
  async close(token, id) {
    const res = await api.shiftClose(token, id);
    return extractData(res);
  },
};