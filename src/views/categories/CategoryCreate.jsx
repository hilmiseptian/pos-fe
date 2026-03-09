import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/lib/utils/alert';
import { categoryCreate } from '@/lib/api/CategoryApi';
import BranchSelector from '@/views/components/BranchSelector';

export default function CategoryCreate() {
  const [token] = useLocalStorage('token', '');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    is_active: true,
    sort_order: 0,
    branch_ids: [],
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      await alertError('You must be logged in.');
      return;
    }
    try {
      setLoading(true);
      const response = await categoryCreate(token, form);
      if (response.status === 201) {
        await alertSuccess('Category created successfully');
        navigate('/categories');
      } else {
        await alertError(response.data.message || 'Failed to create category');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-6">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Food & Beverage"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
          <p className="text-xs opacity-50 mt-1">
            Code will be generated automatically from the name.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Sort Order</label>
            <input
              type="number"
              className="input input-bordered w-full"
              min="0"
              value={form.sort_order}
              onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
            />
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
          <BranchSelector
            token={token}
            selected={form.branch_ids}
            onChange={(ids) => set('branch_ids', ids)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/categories" className="btn btn-outline">
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