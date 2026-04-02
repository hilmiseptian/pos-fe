import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { roleCreate } from '@/modules/roles/api';
import { permissionList } from '@/modules/roles/api';
import PermissionCheckboxGroup from '@/shared/components/PermissionCheckboxGroup';
import { useAuth } from '@/modules/auth/context';

export default function RoleCreate() {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    permissionList(token)
      .then((res) => setGrouped(res.data.data))
      .catch(() => alertError('Failed to load permissions'));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alertError('Role name is required');

    try {
      setLoading(true);
      await roleCreate(token, {
        name,
        description,
        is_active: isActive,
        permission_ids: selectedIds,
      });
      await alertSuccess('Role created successfully');
      navigate('/roles');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box">
      <h2 className="text-2xl font-bold text-center mb-6">Create Role</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Role Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kasir, Manager, Supervisor"
            required
          />
        </div>

        <div>
          <label className="label">Description</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Active</span>
        </label>

        <div>
          <label className="label font-semibold">Permissions</label>
          {grouped.length > 0 ? (
            <PermissionCheckboxGroup
              grouped={grouped}
              selectedIds={selectedIds}
              onChange={setSelectedIds}
            />
          ) : (
            <p className="text-sm opacity-50">Loading permissions...</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/roles" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
