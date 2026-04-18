import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateRole, usePermissions } from '../hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import PermissionCheckboxGroup from '@/shared/components/PermissionCheckboxGroup';

export default function RoleCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateRole();
  const { data: grouped = [] } = usePermissions();

  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
    permission_ids: [],
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: async () => {
        await alertSuccess('Role created successfully');
        navigate('/roles');
      },
      onError: async (err) => {
        await alertError(err.response?.data?.message || err.message);
      },
    });
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
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Kasir, Manager"
            required
          />
        </div>
        <div>
          <label className="label">Description</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox"
            checked={form.is_active}
            onChange={(e) => set('is_active', e.target.checked)}
          />
          <span>Active</span>
        </label>
        <div>
          <label className="label font-semibold">Permissions</label>
          <PermissionCheckboxGroup
            grouped={grouped}
            selectedIds={form.permission_ids}
            onChange={(ids) => set('permission_ids', ids)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link to="/roles" className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
