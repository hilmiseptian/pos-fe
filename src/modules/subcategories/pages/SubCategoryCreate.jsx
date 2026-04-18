import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateSubCategory } from '../hooks';
import { useCategories } from '@/modules/categories/hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';

export default function SubCategoryCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateSubCategory();

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    is_active: true,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.category_id) {
      alertError('Please select a category.');
      return;
    }

    createMutation.mutate(
      { ...form, category_id: Number(form.category_id) },
      {
        onSuccess: async () => {
          await alertSuccess('Sub category created successfully');
          navigate('/sub-categories');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-6">Create Sub Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Category</label>
          {categoriesLoading ? (
            <div className="skeleton h-12 w-full rounded-lg" />
          ) : (
            <select
              className="select select-bordered w-full"
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              required>
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="label">Sub Category Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Hot Coffee, Cold Drinks"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
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

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/sub-categories" className="btn btn-outline">
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
