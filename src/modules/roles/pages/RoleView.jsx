import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRole } from '../hooks';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function RoleView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: role, isLoading, error } = useRole(id);

  if (isLoading) return <FormSkeleton rows={5} />;

  if (error) {
    navigate('/roles');
    return null;
  }

  const groupedPermissions = (role.permissions ?? []).reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Role Detail</h2>

      {/* Basic info */}
      <div className="space-y-3 mb-6">
        <div className="bg-base-100 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-sm opacity-50">Name</span>
          <span className="font-medium">{role.name}</span>
        </div>

        <div className="bg-base-100 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-sm opacity-50">Description</span>
          <span className="font-medium">
            {role.description || <span className="opacity-40">—</span>}
          </span>
        </div>

        <div className="bg-base-100 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-sm opacity-50">Status</span>
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
              <div key={module} className="bg-base-100 rounded-xl px-4 py-3">
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
