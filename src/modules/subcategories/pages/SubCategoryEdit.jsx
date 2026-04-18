import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSubCategory, useUpdateSubCategory } from '../hooks';
import { useCategories } from '@/modules/categories/hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function SubCategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateSubCategory();

  const {
    data: subCategory,
    isLoading: subLoading,
    error,
  } = useSubCategory(id);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    is_active: true,
  });

  useEffect(() => {
    if (!subCategory) return;
    setForm({
      category_id: subCategory.category_id
        ? String(subCategory.category_id)
        : '',
      name: subCategory.name ?? '',
      is_active: subCategory.is_active ?? true,
    });
  }, [subCategory]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    updateMutation.mutate(
      { id: Number(id), ...form, category_id: Number(form.category_id) },
      {
        onSuccess: async () => {
          await alertSuccess('Sub category updated successfully');
          navigate('/sub-categories');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (subLoading || categoriesLoading) return <FormSkeleton rows={4} />;
  if (error) {
    navigate('/sub-categories');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Sub Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Category</label>
          <select
            className="select select-bordered w-full"
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}
            required>
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Sub Category Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
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
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
