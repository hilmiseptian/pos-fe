import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { categoryDetail, categoryUpdate } from '../api';
import FormSkeleton from '@/shared/components/FormSkeleton';
import BranchSelector from '@/shared/components/BranchSelector';
import { useAuth } from '@/modules/auth/context';

export default function CategoryEdit() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(''); // display only

  const [form, setForm] = useState({
    name: '',
    is_active: true,
    sort_order: 0,
    branch_ids: [],
  });

  async function fetchCategory() {
    try {
      setLoading(true);
      const res = await categoryDetail(token, { id });
      const cat = res.data.data;
      setCode(cat.code || '');
      setForm({
        name: cat.name || '',
        is_active: cat.is_active ?? true,
        sort_order: cat.sort_order ?? 0,
        branch_ids: cat.branches?.map((b) => b.id) ?? [],
      });
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchCategory();
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
      const response = await categoryUpdate(token, id, form);
      await alertSuccess(
        response.data.message || 'Category updated successfully',
      );
      navigate('/categories');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FormSkeleton rows={5} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Category</h2>

          <div>
            <label className="label">Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          {/* Code shown as read-only — cannot be changed */}
          <div>
            <label className="label">
              Code{' '}
              <span className="text-xs opacity-50 ml-1">
                (auto-generated, read only)
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full font-mono opacity-60"
              value={code}
              disabled
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Sort Order</label>
              <input
                type="number"
                className="input input-bordered w-full"
                min="0"
                value={form.sort_order}
                onChange={(e) =>
                  set('sort_order', parseInt(e.target.value) || 0)
                }
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

          <div className="flex justify-end gap-2 mt-6">
            <Link to="/categories" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
