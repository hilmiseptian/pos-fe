import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCategory } from '../hooks';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: category, isLoading, error } = useCategory(id);

  if (isLoading) return <FormSkeleton rows={4} />;

  if (error) {
    navigate('/categories');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-box shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Category Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <p>
            <span className="font-bold">Name:</span> {category.name}
          </p>
          <p>
            <span className="font-bold">Code:</span>
            <span className="font-mono ml-1">{category.code}</span>
          </p>
          <p>
            <span className="font-bold">Sort Order:</span>{' '}
            {category.sort_order ?? '—'}
          </p>
          <p>
            <span className="font-bold">Status:</span>{' '}
            <span
              className={`badge badge-sm ${
                category.is_active ? 'badge-success' : 'badge-error'
              }`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>

        <div>
          <p className="font-bold mb-2">Assigned Branches:</p>
          {category.branches?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {category.branches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-base-300 bg-base-100">
                  <div>
                    <p className="text-sm font-medium">{branch.name}</p>
                    <p className="text-xs opacity-50">
                      {branch.city || '-'} · {branch.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-50">No branches assigned.</p>
          )}
        </div>
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
