import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/lib/utils/alert';
import Pagination from '@/views/components/Pagination';
import SkeletonTable from '@/views/components/SkeletonTable';
import { categoryLists, categoryDelete } from '@/lib/api/CategoryApi';

export default function CategoryList() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const response = await categoryLists(token, { page });
      const { data } = response.data;
      setCategories(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      await alertError(error.response?.data?.message || error.message);
      if (error.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this category?');
    if (!confirmed) return;
    try {
      const response = await categoryDelete(token, { id });
      await alertSuccess(
        response.data.message || 'Category deleted successfully',
      );
      fetchCategories(currentPage);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  };

  useEffectOnce(() => {
    fetchCategories();
  });

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
            {loading ? (
              <SkeletonTable rows={8} cols={6} />
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
                          className={`badge badge-sm ${cat.is_active ? 'badge-success' : 'badge-error'}`}>
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
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={fetchCategories}
          />
        </div>
      </div>
    </>
  );
}