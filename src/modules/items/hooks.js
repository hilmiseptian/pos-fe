import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { itemService } from './service';

export const ITEM_KEYS = {
  all:       ['items'],
  paginated: (page) => ['items', 'paginated', page],
  list:      () => ['items', 'all'],
  detail:    (id) => ['items', id],
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function useItemsPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey:        ITEM_KEYS.paginated(page),
    queryFn:         () => itemService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    staleTime:       2 * 60 * 1000,
    enabled:         !!token,
  });
}

export function useItems() {
  const { token } = useAuth();

  return useQuery({
    queryKey:  ITEM_KEYS.list(),
    queryFn:   () => itemService.getAll(token),
    staleTime: 5 * 60 * 1000,
    enabled:   !!token,
  });
}

export function useItem(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ITEM_KEYS.detail(id),
    queryFn:  () => itemService.getById(token, id),
    enabled:  !!token && !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateItem() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => itemService.create(token, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
}

export function useUpdateItem() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => itemService.update(token, id, payload),
    onSuccess:  (_, { id }) => {
      qc.invalidateQueries({ queryKey: ITEM_KEYS.all });
      qc.invalidateQueries({ queryKey: ITEM_KEYS.detail(id) });
    },
  });
}

export function useDeleteItem() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => itemService.remove(token, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
}