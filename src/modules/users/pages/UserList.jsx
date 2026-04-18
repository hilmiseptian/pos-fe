import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsersPaginated, useDeleteUser } from '../hooks';
import { alertConfirm, alertError, alertSuccess } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';

export default function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsersPaginated(page);
  const deleteMutation = useDeleteUser();

  const users = data?.data ?? [];
  const meta = data?.meta;

  async function handleDelete(id) {
    const confirmed = await alertConfirm('Want to delete this user?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('User deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-6">User Management</h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">User List</h2>
        <Link to="/users/create" className="btn btn-primary">
          + Add User
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4 rounded-box">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Branches</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {isLoading ? (
              <SkeletonTable rows={8} />
            ) : (
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        {user.dynamic_role ? (
                          <span className="badge badge-info">
                            {user.dynamic_role.name}
                          </span>
                        ) : (
                          <span className="badge badge-ghost">No Role</span>
                        )}
                      </td>
                      <td>
                        {user.branches?.map((b) => b.name).join(', ') || '-'}
                      </td>
                      <td>
                        <span
                          className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteMutation.isPending}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 opacity-50">
                      No users found.
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