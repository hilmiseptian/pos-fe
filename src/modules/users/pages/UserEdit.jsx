import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { userDetail, userUpdate } from '../api';
import { branchLists } from '@/modules/branches/api';
import { roleAll } from '@/modules/roles/api';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/modules/auth/context';

export default function UserEdit() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
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

  async function fetchData() {
    try {
      setLoading(true);
      const [userRes, branchRes, roleRes] = await Promise.all([
        userDetail(token, { id }),
        branchLists(token),
        roleAll(token),
      ]);

      const u = userRes.data.data;
      setForm({
        name: u.name || '',
        username: u.username || '',
        email: u.email || '',
        phone: u.phone || '',
        password: '',
        password_confirmation: '',
        role_id: u.role_id ? String(u.role_id) : '',
        is_active: u.is_active ?? true,
        branch_ids: u.branches?.map((b) => b.id) ?? [],
      });

      const branchList = branchRes.data.data?.data ?? branchRes.data.data ?? [];
      setBranches(branchList);
      setRoles(roleRes.data.data ?? []);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchData();
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleBranch(branchId) {
    setForm((prev) => ({
      ...prev,
      branch_ids: prev.branch_ids.includes(branchId)
        ? prev.branch_ids.filter((b) => b !== branchId)
        : [...prev.branch_ids, branchId],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    try {
      setLoading(true);
      const response = await userUpdate(token, id, {
        ...form,
        role_id: Number(form.role_id),
      });
      await alertSuccess(response.data.message || 'User updated successfully');
      navigate('/users');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && roles.length === 0) return <FormSkeleton rows={6} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit User</h2>

          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="johndoe"
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              required
            />
          </div>

          {/* Email + Phone */}
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
              <label className="label">
                Phone <span className="text-xs opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
          </div>

          {/* Password — optional on edit */}
          <div>
            <label className="label">
              New Password
              <span className="text-xs opacity-50 ml-1">
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
                  className="opacity-40 hover:opacity-70">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="grow"
                  placeholder="Confirm new password"
                  value={form.password_confirmation}
                  onChange={(e) => set('password_confirmation', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="opacity-40 hover:opacity-70">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </label>
            </div>
          </div>

          {/* Role (dynamic) + Status */}
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

          {/* Branch assignment */}
          <div>
            <label className="label">Assign Branches</label>
            {branches.length === 0 ? (
              <p className="text-sm opacity-50">No branches available.</p>
            ) : (
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
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}>
              {loading ? 'Saving...' : 'Update User'}
            </button>
            <Link to="/users" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
