import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '@/lib/utils/alert';
import { roleDetail } from '@/lib/api/RoleApi';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function RoleView() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchRole() {
    try {
      setLoading(true);
      const response = await roleDetail(token, { id });
      setRole(response.data.data);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchRole();
  });

  if (loading) return <FormSkeleton rows={5} />;
  if (!role) return null;

  // Group permissions by module e.g. { users: [...], orders: [...] }
  const groupedPermissions = (role.permissions ?? []).reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Role Detail</h2>

      {/* Basic info */}
      <div className="space-y-3 mb-6">
        <div>
          <span className="font-bold">Name:</span> {role.name}
        </div>
        <div>
          <span className="font-bold">Description:</span>{' '}
          {role.description || <span className="opacity-40">—</span>}
        </div>
        <div>
          <span className="font-bold">Status:</span>{' '}
          <span
            className={`badge ${role.is_active ? 'badge-success' : 'badge-error'}`}>
            {role.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Permissions grouped by module */}
      <div>
        <p className="font-bold mb-3">
          Permissions{' '}
          <span className="text-xs font-normal opacity-50">
            ({role.permissions?.length ?? 0} assigned)
          </span>
        </p>

        {Object.keys(groupedPermissions).length === 0 ? (
          <p className="text-sm opacity-50">No permissions assigned.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedPermissions).map(([module, perms]) => (
              <div key={module} className="bg-base-100 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold uppercase opacity-50 mb-2">
                  {module}
                </p>
                <div className="flex flex-wrap gap-2">
                  {perms.map((perm) => (
                    <span
                      key={perm.id}
                      className="badge badge-outline badge-sm">
                      {perm.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Link to="/roles" className="btn btn-outline">
          Back
        </Link>
        <Link to={`/roles/${role.id}/edit`} className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
