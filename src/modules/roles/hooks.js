import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { roleService } from './service';

export const ROLE_KEYS = {
  all:         ['roles'],
  paginated:   (page) => ['roles', 'paginated', page],
  list:        () => ['roles', 'all'],
  detail:      (id) => ['roles', id],
  permissions: ['permissions'],
};

export function useRolesPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey:        ROLE_KEYS.paginated(page),
    queryFn:         () => roleService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    enabled:         !!token,
  });
}

export function useRolesAll() {
  const { token } = useAuth();

  return useQuery({
    queryKey:  ROLE_KEYS.list(),
    queryFn:   () => roleService.getAll(token),
    staleTime: 5 * 60 * 1000,
    enabled:   !!token,
  });
}

export function useRole(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn:  () => roleService.getById(token, id),
    enabled:  !!token && !!id,
  });
}

export function usePermissions() {
  const { token } = useAuth();

  return useQuery({
    queryKey:  ROLE_KEYS.permissions,
    queryFn:   () => roleService.getPermissions(token),
    staleTime: Infinity,
    enabled:   !!token,
  });
}

export function useCreateRole() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => roleService.create(token, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ROLE_KEYS.all }),
  });
}

export function useUpdateRole() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => roleService.update(token, id, payload),
    onSuccess:  (_, { id }) => {
      qc.invalidateQueries({ queryKey: ROLE_KEYS.all });
      qc.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) });
    },
  });
}

export function useDeleteRole() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => roleService.remove(token, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ROLE_KEYS.all }),
  });
}