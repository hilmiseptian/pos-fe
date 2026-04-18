import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { branchService } from './service';

export const BRANCH_KEYS = {
  all: ['branches'],
  paginated: (page) => ['branches', 'paginated', page],
  list: () => ['branches', 'all'],
  detail: (id) => ['branches', id],
};

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * For the management table (BranchList page).
 * Paginated, uses placeholderData to avoid layout shift on page change.
 */
export function useBranchesPaginated(page = 1) {
  const { token } = useAuth();

  return useQuery({
    queryKey: BRANCH_KEYS.paginated(page),
    queryFn: () => branchService.getPaginated(token, page),
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
}

/**
 * For selectors and forms.
 * Owners fetch all branches from API.
 * Staff read from their AuthContext user object since they
 * cannot call /branches directly (no branches.view permission).
 */
export function useBranchesForSelector() {
  const { token, user } = useAuth();
  const isOwner = user?.type === 'owner' || user?.type === 'superadmin';

  const query = useQuery({
    queryKey: BRANCH_KEYS.list(),
    queryFn: () => branchService.getAll(token),
    staleTime: 5 * 60 * 1000,
    enabled: !!token && isOwner,
  });

  return {
    branches: isOwner ? (query.data ?? []) : (user?.branches ?? []),
    isLoading: isOwner ? query.isLoading : false,
    error: isOwner ? query.error : null,
  };
}

export function useBranch(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: BRANCH_KEYS.detail(id),
    queryFn: () => branchService.getById(token, id),
    enabled: !!token && !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateBranch() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => branchService.create(token, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BRANCH_KEYS.all }),
  });
}

export function useUpdateBranch() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => branchService.update(token, id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: BRANCH_KEYS.all });
      qc.invalidateQueries({ queryKey: BRANCH_KEYS.detail(id) });
    },
  });
}

export function useDeleteBranch() {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => branchService.remove(token, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BRANCH_KEYS.all }),
  });
}