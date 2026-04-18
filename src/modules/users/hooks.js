import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { userService } from './service';

export const USER_KEYS = {
  all:       ['users'],
  paginated: (page) => ['users', 'paginated', page],
  detail:    (id) => ['users', id],
};

export function useUsersPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey:        USER_KEYS.paginated(page),
    queryFn:         () => userService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    enabled:         !!token,
  });
}

export function useUser(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn:  () => userService.getById(token, id),
    enabled:  !!token && !!id,
  });
}

export function useCreateUser() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => userService.create(token, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}

export function useUpdateUser() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => userService.update(token, id, payload),
    onSuccess:  (_, { id }) => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all });
      qc.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.remove(token, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}