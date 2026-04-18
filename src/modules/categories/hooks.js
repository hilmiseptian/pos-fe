import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { categoryService } from './service';

export const CATEGORY_KEYS = {
  all: ['categories'],
  paginated: (page) => ['categories', 'paginated', page],
  list: () => ['categories', 'all'],
  detail: (id) => ['categories', id],
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function useCategoriesPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey: CATEGORY_KEYS.paginated(page),
    queryFn: () => categoryService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    enabled: !!token,
  });
}

export function useCategories() {
  const { token } = useAuth();

  return useQuery({
    queryKey: CATEGORY_KEYS.list(),
    queryFn: () => categoryService.getAll(token),
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  });
}

export function useCategory(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoryService.getById(token, id),
    enabled: !!token && !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => categoryService.create(token, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
}

export function useUpdateCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => categoryService.update(token, id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(id) });
    },
  });
}

export function useDeleteCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryService.remove(token, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
}