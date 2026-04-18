import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { useCreateItem } from '../hooks';
import { useCategories } from '@/modules/categories/hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';

const UNITS = ['pcs', 'kg', 'liter', 'box'];

export default function ItemCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateItem();

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category_id: '',
    selling_price: '',
    cost_price: '',
    stock: 0,
    unit: 'pcs',
    is_active: true,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    createMutation.mutate(
      {
        ...form,
        category_id: Number(form.category_id),
        selling_price: Number(form.selling_price),
        cost_price: Number(form.cost_price),
        stock: Number(form.stock),
      },
      {
        onSuccess: async () => {
          await alertSuccess('Item created successfully');
          navigate('/items');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  const isSubmitDisabled = categoriesLoading || createMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-6">Create Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Item Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Cappuccino"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>

        {/* SKU */}
        <div>
          <label className="label">SKU</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. BEV-001"
            value={form.sku}
            onChange={(e) => set('sku', e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="label">Category</label>
          {categoriesLoading ? (
            <div className="skeleton h-12 w-full rounded-lg" />
          ) : (
            <select
              className="select select-bordered w-full"
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              required>
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Selling Price</label>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              className="input input-bordered w-full"
              placeholder="0"
              value={form.selling_price}
              onValueChange={(values) => set('selling_price', values.value)}
              required
            />
          </div>
          <div>
            <label className="label">
              Cost Price <span className="text-xs opacity-50">(optional)</span>
            </label>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              className="input input-bordered w-full"
              placeholder="0"
              value={form.cost_price}
              onValueChange={(values) => set('cost_price', values.value)}
            />
          </div>
        </div>

        {/* Stock + Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Stock</label>
            <input
              type="number"
              className="input input-bordered w-full"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Unit</label>
            <select
              className="select select-bordered w-full"
              value={form.unit}
              onChange={(e) => set('unit', e.target.value)}>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select
            className="select select-bordered w-full"
            value={String(form.is_active)}
            onChange={(e) => set('is_active', e.target.value === 'true')}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/items" className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitDisabled}>
            {categoriesLoading
              ? 'Loading...'
              : createMutation.isPending
                ? 'Saving...'
                : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
