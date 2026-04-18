import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess, alertConfirm } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';
import { useDeleteSubCategory, useSubCategoriesPaginated } from '../hooks';

export default function SubCategoryList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSubCategoriesPaginated(page);
  const deleteMutation = useDeleteSubCategory();

  const subCategories = data?.data ?? [];
  const meta = data?.meta;

  if (error) {
    navigate('/');
    return null;
  }

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this sub category?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('Sub Category deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  };

  return (
    <>
      <h1 className="text-green-600 text-3xl font-bold text-center my-6">
        Sub Category Management
      </h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Sub Category List</h2>
        <Link to="/sub-categories/create" className="btn btn-primary">
          + Add Sub Category
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {isLoading ? (
              <SkeletonTable cols={4} />
            ) : (
              <tbody>
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <tr key={sub.id}>
                      <td className="font-bold">{sub.category.name}</td>
                      <td className="font-bold">{sub.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            sub.is_active ? 'badge-success' : 'badge-error'
                          }`}>
                          {sub.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Link
                          to={`/sub-categories/${sub.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/sub-categories/${sub.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
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
