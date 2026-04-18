import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { orderService } from './service';

export const ORDER_KEYS = {
  all: ['orders'],
  paginated: (page) => ['orders', 'paginated', page],
  open: () => ['orders', 'open'],
  detail: (id) => ['orders', id],
};

export function useOrdersPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.paginated(page),
    queryFn: () => orderService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
}

export function useOpenOrders() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.open(),
    queryFn: () => orderService.getOpen(token),
    staleTime: 30 * 1000,
    enabled: !!token,
  });
}

export function useOrder(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => orderService.getById(token, id),
    enabled: !!token && !!id,
  });
}

export function useCreateOrder() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => orderService.create(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
  });
}

export function useCancelOrder() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => orderService.cancel(token, id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
    },
  });
}

export function useAddOrderItem(orderId) {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => orderService.addItem(token, orderId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
    },
  });
}

export function useUpdateOrderItem(orderId) {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ detailId, ...payload }) =>
      orderService.updateItem(token, orderId, detailId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
    },
  });
}

export function useRemoveOrderItem(orderId) {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (detailId) => orderService.removeItem(token, orderId, detailId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
    },
  });
}

export function useProcessPayment(orderId) {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => orderService.processPayment(token, orderId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
    },
  });
}