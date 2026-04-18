import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRole, useUpdateRole, usePermissions } from '../hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import PermissionCheckboxGroup from '@/shared/components/PermissionCheckboxGroup';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function RoleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateRole();

  const { data: role, isLoading: roleLoading } = useRole(id);
  const { data: grouped = [], isLoading: permLoading } = usePermissions();

  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
    permission_ids: [],
  });

  useEffect(() => {
    if (!role) return;
    setForm({
      name: role.name ?? '',
      description: role.description ?? '',
      is_active: role.is_active ?? true,
      permission_ids: role.permissions?.map((p) => p.id) ?? [],
    });
  }, [role]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateMutation.mutate(
      { id: Number(id), ...form },
      {
        onSuccess: async () => {
          await alertSuccess('Role updated successfully');
          navigate('/roles');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (roleLoading || permLoading) return <FormSkeleton rows={5} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Role</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Role Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
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
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
