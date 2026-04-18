import { Link, useNavigate, useParams } from 'react-router-dom';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useItem } from '../hooks';

export default function ItemView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isLoading, error } = useItem(id);

  if (isLoading) return <FormSkeleton rows={5} />;

  if (!item) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Item not found
      </div>
    );
  }

  if (error) {
    navigate('/items');
    return null;
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
