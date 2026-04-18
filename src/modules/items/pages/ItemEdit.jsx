import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { NumericFormat } from 'react-number-format';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useItem, useUpdateItem } from '../hooks';
import { useCategories } from '@/modules/categories/hooks';

export default function ItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateItem();

  const { data: item, isLoading, error } = useItem(id);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    sku: '',
    selling_price: '',
    cost_price: '',
    stock: '',
    unit: '',
    is_active: true,
  });

  useEffect(() => {
    if (!item) return;
    setForm({
      category_id: item.category_id || '',
      name: item.name || '',
      sku: item.sku || '',
      selling_price: item.selling_price || '',
      cost_price: item.cost_price || '',
      stock: item.stock || '',
      unit: item.unit || '',
      is_active: item.is_active ?? true,
    });
  }, [item]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    updateMutation.mutate(
      { id: Number(id), ...form, category_id: Number(form.category_id) },
      {
        onSuccess: async () => {
          await alertSuccess('Item updated successfully');
          navigate('/items');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (isLoading || categoriesLoading) return <FormSkeleton rows={6} />;
  if (error) {
    navigate('/items');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Item</h2>

        <label className="label">Category</label>
        <select
          name="category_id"
          className="select select-bordered w-full"
          value={item.category_id}
          onChange={(e) => set('category_id', e.target.value)}
          required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={item.name}
          onChange={(e) => set('name', e.target.value)}
        />

        <label className="label">SKU</label>
        <input
          type="text"
          name="sku"
          className="input input-bordered w-full"
          value={item.sku}
          onChange={(e) => set('sku', e.target.value)}
        />

        <label className="label">Selling Price</label>
        <NumericFormat
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          className="input input-bordered w-full"
          value={item.selling_price}
          onValueChange={(values) =>
            setForm((prev) => ({ ...prev, selling_price: values.value }))
          }
        />

        <label className="label">Cost Price</label>
        <NumericFormat
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          className="input input-bordered w-full"
          value={item.cost_price}
          onValueChange={(values) =>
            setForm((prev) => ({ ...prev, cost_price: values.value }))
          }
        />

        <label className="label">Stock</label>
        <input
          type="number"
          name="stock"
          className="input input-bordered w-full"
          value={item.stock}
          onChange={(e) => set('category_id', e.target.value)}
        />

        <label className="label">Unit</label>
        <input
          type="text"
          name="unit"
          className="input input-bordered w-full"
          value={item.unit}
          onChange={(e) => set('category_id', e.target.value)}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={item.is_active}
            onChange={(e) => set('category_id', e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/items" className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
