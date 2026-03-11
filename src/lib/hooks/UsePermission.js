import { useAuth } from '@/lib/context/AuthContext';

/**
 * Hook for permission checks anywhere in the app.
 *
 * Usage:
 *   const { can, cannot } = usePermission();
 *   if (can('users.create')) { ... }
 *   if (cannot('orders.delete')) { ... }
 */
export function usePermission() {
  const { can } = useAuth();

  return {
    can,
    cannot: (slug) => !can(slug),
  };
}