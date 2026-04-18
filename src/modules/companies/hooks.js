import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { companyService } from './service';

export const COMPANY_KEYS = {
  all:       ['companies'],
  paginated: (page) => ['companies', 'paginated', page],
  detail:    (id) => ['companies', id],
};

export function useCompaniesPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey:        COMPANY_KEYS.paginated(page),
    queryFn:         () => companyService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    enabled:         !!token,
  });
}

export function useCompany(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: COMPANY_KEYS.detail(id),
    queryFn:  () => companyService.getById(token, id),
    enabled:  !!token && !!id,
  });
}

export function useCreateCompany() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => companyService.create(token, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: COMPANY_KEYS.all }),
  });
}

export function useUpdateCompany() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => companyService.update(token, id, payload),
    onSuccess:  (_, { id }) => {
      qc.invalidateQueries({ queryKey: COMPANY_KEYS.all });
      qc.invalidateQueries({ queryKey: COMPANY_KEYS.detail(id) });
    },
  });
}

export function useDeleteCompany() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => companyService.remove(token, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: COMPANY_KEYS.all }),
  });
}