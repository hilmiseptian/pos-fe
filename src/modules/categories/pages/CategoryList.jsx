import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategoriesPaginated, useDeleteCategory } from '../hooks';
import { alertConfirm, alertError, alertSuccess } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';

export default function CategoryList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCategoriesPaginated(page);
  const deleteMutation = useDeleteCategory();

  const categories = data?.data ?? [];
  const meta = data?.meta;

  if (error) {
    navigate('/');
    return null;
  }

  async function handleDelete(id) {
    const confirmed = await alertConfirm('Want to delete this category?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('Category deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-6">
        Category Management
      </h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Category List</h2>
        <Link to="/categories/create" className="btn btn-primary">
          + Add Category
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4 rounded-box">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Branches</th>
                <th>Sort</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {isLoading ? (
              <SkeletonTable rows={8} />
            ) : (
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="font-bold">{cat.name}</td>
                      <td className="text-sm opacity-70 font-mono">
                        {cat.code}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {cat.branches?.length > 0 ? (
                            cat.branches.map((b) => (
                              <span
                                key={b.id}
                                className="badge badge-sm badge-outline">
                                {b.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs opacity-40">—</span>
                          )}
                        </div>
                      </td>
                      <td>{cat.sort_order ?? '—'}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            cat.is_active ? 'badge-success' : 'badge-error'
                          }`}>
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-1">
                        <Link
                          to={`/categories/${cat.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/categories/${cat.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleteMutation.isPending}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center opacity-50 py-8">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          {meta && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
}