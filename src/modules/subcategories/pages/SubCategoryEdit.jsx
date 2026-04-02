import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { subCategoryDetail, subCategoryUpdate } from '../api';
import { categoryLists } from '@/modules/categories/api';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useAuth } from '@/modules/auth/context';

export default function SubCategoryEdit() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [subCategory, setSubCategory] = useState({
    category_id: '',
    name: '',
    is_active: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCategories() {
    try {
      const response = await categoryLists(token);
      setCategories(response.data.data.data || []);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  async function fetchSubCategory() {
    try {
      setLoading(true);

      const response = await subCategoryDetail(token, { id });
      const { data } = response.data;

      setSubCategory({
        category_id: data.category_id || '',
        name: data.name || '',
        code: data.code || '',
        is_active: data.is_active ?? true,
      });
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);

      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchCategories();
    fetchSubCategory();
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSubCategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const formData = new FormData();

    Object.keys(subCategory).forEach((key) => {
      formData.append(key, subCategory[key]);
    });

    formData.append('_method', 'PUT');

    try {
      setLoading(true);

      const response = await subCategoryUpdate(token, id, formData);

      await alertSuccess(
        response.data.message || 'Sub Category updated successfully',
      );

      navigate('/sub-categories');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FormSkeleton rows={4} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Sub Category</h2>

        <label className="label">Category</label>
        <select
          name="category_id"
          className="select select-bordered w-full"
          value={subCategory.category_id}
          onChange={handleChange}>
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={subCategory.name}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={subCategory.is_active}
            onChange={handleChange}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/sub-categories" className="btn btn-outline">
            Cancel
          </Link>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
