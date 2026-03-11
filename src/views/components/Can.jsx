import { usePermission } from '@/lib/hooks/usePermission';

/**
 * Render children only if user has the required permission.
 *
 * Usage:
 *   <Can permission="users.create">
 *     <button>Add User</button>
 *   </Can>
 *
 *   <Can permission="orders.delete" fallback={<span>No access</span>}>
 *     <button>Delete</button>
 *   </Can>
 */
export default function Can({ permission, fallback = null, children }) {
  const { can } = usePermission();

  if (!can(permission)) return fallback;

  return children;
}
