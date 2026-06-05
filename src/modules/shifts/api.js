import { api, authHeaders } from '@/shared/lib/axios';

export const shiftActive = (token, branchId) =>
  api.get('/shifts/active', {
    headers: authHeaders(token),
    params: branchId ? { branch_id: branchId } : {},
  });

export const shiftToday = (token, branchId) =>
  api.get('/shifts/today', {
    headers: authHeaders(token),
    params: branchId ? { branch_id: branchId } : {},
  });

export const shiftOpen = (token, branchId) =>
  api.post('/shifts/open', branchId ? { branch_id: branchId } : {}, {
    headers: authHeaders(token),
  });

export const shiftClose = (token, id) =>
  api.patch(`/shifts/${id}/close`, {}, { headers: authHeaders(token) });