import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '@/lib/utils/alert';
import { categoryDetail } from '@/lib/api/CategoryApi';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function CategoryView() {
  const [token] = useLocalStorage('token', '');
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCategory() {
    try {
      setLoading(true);
      const response = await categoryDetail(token, { id });
      setCategory(response.data.data);
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

  if (loading) return <FormSkeleton rows={4} />;

  if (!category) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Category not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Category Details</h1>

      <div className="space-y-3">
        <p>
          <strong>Name:</strong> {category.name}
        </p>
        <p>
          <strong>Code:</strong> {category.code}
        </p>
        <p>
          <strong>Sort Order:</strong> {category.sort_order ?? '-'}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`badge ${
              category.is_active ? 'badge-success' : 'badge-error'
            }`}>
            {category.is_active ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Link to="/categories" className="btn btn-outline">
          Back
        </Link>
        <Link
          to={`/categories/${category.id}/edit`}
          className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
