import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRolesPaginated, useDeleteRole } from '../hooks';
import { alertConfirm, alertError, alertSuccess } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';
import Can from '@/shared/components/Can';

export default function RoleList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRolesPaginated(page);
  const deleteMutation = useDeleteRole();

  const roles = data?.data ?? [];
  const meta = data?.meta;

  async function handleDelete(id) {
    const confirmed = await alertConfirm('Want to delete this role?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('Role deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-6">Role Management</h1>

      <div className="flex justify-between items-center max-w-5xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Role List</h2>
        <Can permission="roles.create">
          <Link to="/roles/create" className="btn btn-primary">
            + Add Role
          </Link>
        </Can>
      </div>

      <div className="max-w-5xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4 rounded-box">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {isLoading ? (
              <SkeletonTable rows={6} />
            ) : (
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td className="font-bold">{role.name}</td>
                      <td className="text-sm opacity-70">
                        {role.description || '—'}
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {role.permissions?.length ?? 0} permissions
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${role.is_active ? 'badge-success' : 'badge-error'}`}>
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Can permission="roles.view">
                          <Link
                            to={`/roles/${role.id}`}
                            className="btn btn-xs btn-info">
                            View
                          </Link>
                        </Can>
                        <Can permission="roles.edit">
                          <Link
                            to={`/roles/${role.id}/edit`}
                            className="btn btn-xs btn-warning">
                            Edit
                          </Link>
                        </Can>
                        <Can permission="roles.delete">
                          <button
                            onClick={() => handleDelete(role.id)}
                            disabled={deleteMutation.isPending}
                            className="btn btn-xs btn-error">
                            Delete
                          </button>
                        </Can>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center opacity-50 py-8">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          {meta && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
}