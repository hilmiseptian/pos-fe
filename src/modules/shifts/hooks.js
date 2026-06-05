import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context';
import { shiftService } from './service';

export const SHIFT_KEYS = {
  active: (branchId) => ['shifts', 'active', branchId],
  today: (branchId) => ['shifts', 'today', branchId],
};

export function useActiveShift(branchId) {
  const { token } = useAuth();
  return useQuery({
    queryKey: SHIFT_KEYS.active(branchId),
    queryFn: () => shiftService.getActive(token, branchId),
    enabled: !!token && !!branchId,
    staleTime: 30 * 1000,
  });
}

export function useTodayShifts(branchId) {
  const { token } = useAuth();
  return useQuery({
    queryKey: SHIFT_KEYS.today(branchId),
    queryFn: () => shiftService.getToday(token, branchId),
    enabled: !!token && !!branchId,
  });
}

export function useOpenShift(branchId) {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => shiftService.open(token, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
}

export function useCloseShift(branchId) {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => shiftService.close(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
}