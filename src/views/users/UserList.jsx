import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/lib/utils/alert';
import Pagination from '@/views/components/Pagination';
import SkeletonTable from '@/views/components/SkeletonTable';
import { userLists, userDelete } from '@/lib/api/UserApi';

const ROLE_BADGE = {
  admin: 'badge-info',
  cashier: 'badge-warning',
  owner: 'badge-success',
};

export default function UserList() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userLists(token, { page });
      const { data } = response.data;
      setUsers(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      await alertError(error.response?.data?.message || error.message);
      if (error.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this user?');
    if (!confirmed) return;
    try {
      const response = await userDelete(token, { id });
      await alertSuccess(response.data.message || 'User deleted successfully');
      fetchUsers(currentPage);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  };

  useEffectOnce(() => {
    fetchUsers();
  });

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
            {loading ? (
              <SkeletonTable rows={8} cols={8} />
            ) : (
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="font-bold">{user.name}</td>
                      <td className="text-sm opacity-70">@{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${ROLE_BADGE[user.role] ?? 'badge-ghost'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {user.branches?.length > 0 ? (
                            user.branches.map((b) => (
                              <span
                                key={b.id}
                                className="badge badge-sm badge-outline">
                                {b.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs opacity-40">—</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-1">
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
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center opacity-50 py-8">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={fetchUsers}
          />
        </div>
      </div>
    </>
  );
}
