import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { subCategoryService } from './service';

export const SUBCATEGORY_KEYS = {
  all: ['subcategories'],
  paginated: (page) => ['subcategories', 'paginated', page],
  detail: (id) => ['subcategories', id],
};

export function useSubCategoriesPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey: SUBCATEGORY_KEYS.paginated(page),
    queryFn: () => subCategoryService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
}

export function useSubCategory(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: SUBCATEGORY_KEYS.detail(id),
    queryFn: () => subCategoryService.getById(token, id),
    enabled: !!token && !!id,
  });
}

export function useCreateSubCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => subCategoryService.create(token, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.all }),
  });
}

export function useUpdateSubCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => subCategoryService.update(token, id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.all });
      qc.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.detail(id) });
    },
  });
}

export function useDeleteSubCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => subCategoryService.remove(token, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.all }),
  });
}