import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/lib/utils/alert';
import Pagination from '@/views/components/Pagination';
import SkeletonTable from '@/views/components/SkeletonTable';
import { roleLists, roleDelete } from '@/lib/api/RoleApi';
import Can from '@/views/components/Can';

export default function RoleList() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchRoles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await roleLists(token, { page });
      setRoles(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setLastPage(response.data.data.last_page);
    } catch (error) {
      await alertError(error.response?.data?.message || error.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this role?');
    if (!confirmed) return;
    try {
      const response = await roleDelete(token, { id });
      await alertSuccess(response.data.message || 'Role deleted successfully');
      fetchRoles(currentPage);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  };

  useEffectOnce(() => { fetchRoles(); });

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

            {loading ? (
              <SkeletonTable rows={6} cols={5} />
            ) : (
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td className="font-bold">{role.name}</td>
                      <td className="text-sm opacity-70">{role.description || '—'}</td>
                      <td>
                        <span className="badge badge-outline">
                          {role.permissions?.length ?? 0} permissions
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${role.is_active ? 'badge-success' : 'badge-error'}`}>
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Can permission="roles.view">
                          <Link to={`/roles/${role.id}`} className="btn btn-xs btn-info">
                            View
                          </Link>
                        </Can>
                        <Can permission="roles.edit">
                          <Link to={`/roles/${role.id}/edit`} className="btn btn-xs btn-warning">
                            Edit
                          </Link>
                        </Can>
                        <Can permission="roles.delete">
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="btn btn-xs btn-error">
                            Delete
                          </button>
                        </Can>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No roles found.</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={fetchRoles} />
        </div>
      </div>
    </>
  );
}
