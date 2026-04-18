import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCategory, useUpdateCategory } from '../hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import BranchSelector from '@/shared/components/BranchSelector';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateCategory();

  const { data: category, isLoading, error } = useCategory(id);

  const [form, setForm] = useState({
    name: '',
    is_active: true,
    sort_order: 0,
    branch_ids: [],
  });

  // Populate form once data arrives
  useEffect(() => {
    if (!category) return;
    setForm({
      name: category.name ?? '',
      is_active: category.is_active ?? true,
      sort_order: category.sort_order ?? 0,
      branch_ids: category.branches?.map((b) => b.id) ?? [],
    });
  }, [category]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    updateMutation.mutate(
      { id: Number(id), ...form },
      {
        onSuccess: async () => {
          await alertSuccess('Category updated successfully');
          navigate('/categories');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (isLoading) return <FormSkeleton rows={5} />;
  if (error) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={category?.code ?? ''}
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
            selected={form.branch_ids}
            onChange={(ids) => set('branch_ids', ids)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/categories" className="btn btn-outline">
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
