import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/lib/utils/alert';
import { itemDetail, itemUpdate } from '@/lib/api/ItemApi';
import { categoryLists } from '@/lib/api/CategoryApi';
import { NumericFormat } from 'react-number-format';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function ItemEdit() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [item, setItem] = useState({
    category_id: '',
    name: '',
    sku: '',
    selling_price: '',
    cost_price: '',
    stock: '',
    unit: '',
    is_active: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchItem() {
    try {
      setLoading(true);
      const response = await itemDetail(token, { id });
      const data = response.data;

      setItem({
        category_id: data.category_id || '',
        name: data.name || '',
        sku: data.sku || '',
        selling_price: data.selling_price || '',
        cost_price: data.cost_price || '',
        stock: data.stock || '',
        unit: data.unit || '',
        is_active: data.is_active ?? true,
      });
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await categoryLists(token);
      setCategories(response.data.data);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  useEffectOnce(() => {
    fetchItem();
    fetchCategories();
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const formData = new FormData();
    Object.keys(item).forEach((key) => {
      formData.append(key, item[key]);
    });
    formData.append('_method', 'PATCH');

    try {
      setLoading(true);
      const response = await itemUpdate(token, id, formData);
      await alertSuccess(response.data.message || 'Item updated successfully');
      navigate('/items');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FormSkeleton rows={6} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Item</h2>

        <label className="label">Category</label>
        <select
          name="category_id"
          className="select select-bordered w-full"
          value={item.category_id}
          onChange={handleChange}
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
          onChange={handleChange}
        />

        <label className="label">SKU</label>
        <input
          type="text"
          name="sku"
          className="input input-bordered w-full"
          value={item.sku}
          onChange={handleChange}
        />

        <label className="label">Selling Price</label>
        <NumericFormat
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          className="input input-bordered w-full"
          value={item.selling_price}
          onValueChange={(values) =>
            setItem((prev) => ({ ...prev, selling_price: values.value }))
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
            setItem((prev) => ({ ...prev, cost_price: values.value }))
          }
        />

        <label className="label">Stock</label>
        <input
          type="number"
          name="stock"
          className="input input-bordered w-full"
          value={item.stock}
          onChange={handleChange}
        />

        <label className="label">Unit</label>
        <input
          type="text"
          name="unit"
          className="input input-bordered w-full"
          value={item.unit}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={item.is_active}
            onChange={handleChange}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/items" className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
