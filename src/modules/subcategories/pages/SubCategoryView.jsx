import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '@/shared/utils/alert';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { subCategoryDetail } from '../api';

export default function SubCategoryView() {
  const [token] = useLocalStorage('token', '');
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCategory() {
    try {
      setLoading(true);
      const response = await subCategoryDetail(token, { id });
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
        Sub Category not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sub Category Details
      </h1>

      <div className="space-y-3">
        <p>
          <strong>Category:</strong> {category.category.name}
        </p>
        <p>
          <strong>Name:</strong> {category.name}
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
        <Link to="/sub-categories" className="btn btn-outline">
          Back
        </Link>
        <Link
          to={`/sub-categories/${category.id}/edit`}
          className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
