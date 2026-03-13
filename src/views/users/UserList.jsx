import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/lib/utils/alert';
import Pagination from '@/views/components/Pagination';
import SkeletonTable from '@/views/components/SkeletonTable';
import { userLists, userDelete } from '@/lib/api/UserApi';

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
                        {user.branches?.length > 0
                          ? user.branches.map((b) => b.name).join(', ')
                          : '-'}
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
                          className="btn btn-xs btn-ghost">
                          View
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleDelete(user.id)}>
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
        </div>

        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={fetchUsers}
        />
      </div>
    </>
  );
}