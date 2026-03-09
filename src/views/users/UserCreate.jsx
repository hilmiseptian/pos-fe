import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/lib/utils/alert';
import { userCreate } from '@/lib/api/UserApi';
import { branchLists } from '@/lib/api/BranchApi';
import { Eye, EyeOff } from 'lucide-react';

export default function UserCreate() {
  const [token] = useLocalStorage('token', '');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'cashier',
    is_active: true,
    branch_ids: [],
  });

  useEffectOnce(() => {
    fetchBranches();
  });

  async function fetchBranches() {
    try {
      const res = await branchLists(token);
      // branchLists returns paginated — grab all from data.data or data
      const list = res.data.data?.data ?? res.data.data ?? [];
      setBranches(list);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    try {
      setLoading(true);
      const response = await userCreate(token, form);
      if (response.status === 201) {
        await alertSuccess('User created successfully');
        navigate('/users');
      } else {
        await alertError(response.data.message || 'Failed to create user');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-6">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="john@email.com"
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
              placeholder="+62 812 xxxx xxxx"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Password</label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showPass ? 'text' : 'password'}
                className="grow"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="opacity-40 hover:opacity-70">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </label>
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="grow"
                placeholder="Repeat password"
                value={form.password_confirmation}
                onChange={(e) => set('password_confirmation', e.target.value)}
                required
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

        {/* Role + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Role</label>
            <select
              className="select select-bordered w-full"
              value={form.role}
              onChange={(e) => set('role', e.target.value)}>
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="select select-bordered w-full"
              value={form.is_active}
              onChange={(e) => set('is_active', e.target.value === 'true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Branch assignment */}
        <div>
          <label className="label">
            Assign Branches
            <span className="text-xs opacity-50 ml-1">
              {form.role === 'cashier'
                ? '(cashier should have 1)'
                : '(admin can have multiple)'}
            </span>
          </label>
          {branches.length === 0 ? (
            <p className="text-sm opacity-50">No branches available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {branches.map((branch) => (
                <label
                  key={branch.id}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer
                              transition-all duration-150
                              ${
                                form.branch_ids.includes(branch.id)
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-base-300 hover:border-primary/40'
                              }`}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={form.branch_ids.includes(branch.id)}
                    onChange={() => toggleBranch(branch.id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{branch.name}</p>
                    <p className="text-xs opacity-50">
                      {branch.city || branch.code}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/users" className="btn btn-outline">
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
