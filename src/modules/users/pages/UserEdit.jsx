import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useUser, useUpdateUser } from '../hooks';
import { useBranchesForSelector } from '@/modules/branches/hooks';
import { useRolesAll } from '@/modules/roles/hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateUser();
  const { branches } = useBranchesForSelector();
  const { data: roles = [] } = useRolesAll();

  const { data: user, isLoading } = useUser(id);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    is_active: true,
    branch_ids: [],
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      password: '',
      password_confirmation: '',
      role_id: user.role_id ? String(user.role_id) : '',
      is_active: user.is_active ?? true,
      branch_ids: user.branches?.map((b) => b.id) ?? [],
    });
  }, [user]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleBranch(id) {
    setForm((prev) => ({
      ...prev,
      branch_ids: prev.branch_ids.includes(id)
        ? prev.branch_ids.filter((b) => b !== id)
        : [...prev.branch_ids, id],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateMutation.mutate(
      { id: Number(id), ...form, role_id: Number(form.role_id) },
      {
        onSuccess: async () => {
          await alertSuccess('User updated successfully');
          navigate('/users');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (isLoading) return <FormSkeleton rows={6} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Username</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">
            New Password{' '}
            <span className="text-xs opacity-50">
              (leave blank to keep current)
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showPass ? 'text' : 'password'}
                className="grow"
                placeholder="New password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="opacity-40">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="grow"
                placeholder="Confirm"
                value={form.password_confirmation}
                onChange={(e) => set('password_confirmation', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="opacity-40">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Role</label>
            <select
              className="select select-bordered w-full"
              value={form.role_id}
              onChange={(e) => set('role_id', e.target.value)}
              required>
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={String(role.id)}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="select select-bordered w-full"
              value={String(form.is_active)}
              onChange={(e) => set('is_active', e.target.value === 'true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Assign Branches</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {branches.map((branch) => (
              <label
                key={branch.id}
                className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={form.branch_ids.includes(branch.id)}
                  onChange={() => toggleBranch(branch.id)}
                />
                <span>{branch.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Update User'}
          </button>
          <Link to="/users" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
