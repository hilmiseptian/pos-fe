import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSubCategory } from '../hooks';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function SubCategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subCategory, isLoading, error } = useSubCategory(id);

  if (isLoading) return <FormSkeleton rows={4} />;

  if (!subCategory) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Sub Category not found
      </div>
    );
  }

  if (error) {
    navigate('/sub-categories');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sub Category Details
      </h1>

      <div className="space-y-3">
        <p>
          <strong>Category:</strong> {subCategory.category.name}
        </p>
        <p>
          <strong>Name:</strong> {subCategory.name}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`badge ${
              subCategory.is_active ? 'badge-success' : 'badge-error'
            }`}>
            {subCategory.is_active ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Link to="/sub-categories" className="btn btn-outline">
          Back
        </Link>
        <Link
          to={`/sub-categories/${subCategory.id}/edit`}
          className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
