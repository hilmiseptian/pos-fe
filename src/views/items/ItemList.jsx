import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { useLocalStorage } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/lib/utils/alert';
import Pagination from '@/views/components/Pagination';
import SkeletonTable from '@/views/components/SkeletonTable';
import { itemDelete, itemLists } from '@/lib/api/ItemApi';

export default function ItemList() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchitems = async (page = 1) => {
    try {
      setLoading(true);
      const response = await itemLists(token, { page });
      setItems(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      await alertError(error.response?.data?.message || error.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this item?');
    if (!confirmed) return;

    try {
      const response = await itemDelete(token, { id });
      await alertSuccess(response.data.message || 'Item deleted successfully');
      fetchitems(currentPage);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  };

  useEffectOnce(() => {
    fetchitems();
  });

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
            {loading ? (
              <SkeletonTable rows={8} />
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
                          className={`badge ${
                            itm.is_active === 'active'
                              ? 'badge-success'
                              : itm.is_active === 'inactive'
                                ? 'badge-warning'
                                : 'badge-error'
                          }`}>
                          {itm.is_active}
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
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={fetchitems}
          />
        </div>
      </div>
    </>
  );
}
