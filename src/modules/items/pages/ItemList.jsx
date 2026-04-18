import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItemsPaginated, useDeleteItem } from '../hooks';
import { alertConfirm, alertError, alertSuccess } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';

export default function ItemList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useItemsPaginated(page);
  const deleteMutation = useDeleteItem();

  const items = data?.data ?? [];
  const meta = data?.meta;

  if (error) {
    navigate('/');
    return null;
  }

  async function handleDelete(id) {
    const confirmed = await alertConfirm('Want to delete this item?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('Item deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  }

  return (
    <>
      <h1 className="text-green-600 text-3xl font-bold text-center my-6">
        Item Management
      </h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Item List</h2>
        <Link to="/items/create" className="btn btn-primary">
          + Add Item
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Categories</th>
                <th>HPP</th>
                <th>Selling Price</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {isLoading ? (
              <SkeletonTable cols={10} />
            ) : (
              <tbody>
                {items.length > 0 ? (
                  items.map((itm) => (
                    <tr key={itm.id}>
                      <td className="font-bold">{itm.name}</td>
                      <td>{itm.sku}</td>
                      <td>{itm.category.name || '-'}</td>
                      <td>${parseFloat(itm.cost_price).toLocaleString()}</td>
                      <td>${parseFloat(itm.selling_price).toLocaleString()}</td>
                      <td>{itm.stock || '-'}</td>
                      <td>{itm.min_stock || '-'}</td>
                      <td>{itm.unit || '-'}</td>
                      <td>
                        <span
                          className={`badge ${itm.is_active ? 'badge-success' : 'badge-error'}`}>
                          {itm.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Link
                          to={`/items/${itm.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/items/${itm.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(itm.id)}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No items found.
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
