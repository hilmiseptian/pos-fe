import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { roleDetail, roleUpdate, permissionList } from '@/modules/roles/api';
import PermissionCheckboxGroup from '@/shared/components/PermissionCheckboxGroup';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useAuth } from '@/modules/auth/context';

export default function RoleEdit() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffectOnce(() => {
    Promise.all([roleDetail(token, { id }), permissionList(token)])
      .then(([roleRes, permRes]) => {
        const role = roleRes.data.data;
        setName(role.name);
        setDescription(role.description || '');
        setIsActive(role.is_active);
        setSelectedIds(role.permissions.map((p) => p.id));
        setGrouped(permRes.data.data);
      })
      .catch((err) => alertError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await roleUpdate(token, id, {
        name,
        description,
        is_active: isActive,
        permission_ids: selectedIds,
      });
      await alertSuccess('Role updated successfully');
      navigate('/roles');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FormSkeleton rows={5} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Role</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Role Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <PermissionCheckboxGroup
            grouped={grouped}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/roles" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
