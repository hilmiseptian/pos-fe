import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '@/lib/utils/alert';
import { itemDetail } from '@/lib/api/ItemApi';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function ItemView() {
  const [token] = useLocalStorage('token', '');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchItem() {
    try {
      setLoading(true);
      const response = await itemDetail(token, { id });
      const { data } = response;
      setItem(data);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchItem();
  });

  if (loading) return <FormSkeleton rows={5} />;

  if (!item) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Item not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Item Details</h1>

      <div className="space-y-3">
        <p>
          <strong>Name:</strong> {item.name}
        </p>
        <p>
          <strong>SKU:</strong> {item.sku}
        </p>
        <p>
          <strong>Selling Price:</strong>{' '}
          {Number(item.selling_price).toLocaleString()}
        </p>
        <p>
          <strong>Cost Price:</strong>{' '}
          {Number(item.cost_price).toLocaleString()}
        </p>
        <p>
          <strong>Stock:</strong> {item.stock}
        </p>
        <p>
          <strong>Unit:</strong> {item.unit}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`badge ${
              item.is_active ? 'badge-success' : 'badge-error'
            }`}>
            {item.is_active ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Link to="/items" className="btn btn-outline">
          Back
        </Link>
        <Link to={`/items/${item.id}/edit`} className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
