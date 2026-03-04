import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/lib/utils/alert';
import { categoryDetail, categoryUpdate } from '@/lib/api/CategoryApi';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function CategoryEdit() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    name: '',
    code: '',
    sort_order: '',
    is_active: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCategory() {
    try {
      setLoading(true);
      const response = await categoryDetail(token, { id });
      const { data } = response.data;

      setCategory({
        name: data.name || '',
        code: data.code || '',
        sort_order: data.sort_order || '',
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
    fetchCategory();
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory((prev) => ({
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
    Object.keys(category).forEach((key) => {
      formData.append(key, category[key]);
    });
    formData.append('_method', 'PATCH');

    try {
      setLoading(true);
      const response = await categoryUpdate(token, id, formData);
      await alertSuccess(
        response.data.message || 'Category updated successfully'
      );
      navigate('/categories');
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
        <h2 className="text-2xl font-bold text-center">Edit Category</h2>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={category.name}
          onChange={handleChange}
        />

        <label className="label">Code</label>
        <input
          type="text"
          name="code"
          className="input input-bordered w-full"
          value={category.code}
          onChange={handleChange}
        />

        <label className="label">Sort Order</label>
        <input
          type="number"
          name="sort_order"
          className="input input-bordered w-full"
          value={category.sort_order}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={category.is_active}
            onChange={handleChange}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/categories" className="btn btn-outline">
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
