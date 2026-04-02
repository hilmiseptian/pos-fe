import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { itemCreate } from '../api';
import { categoryLists } from '@/modules/categories/api';
import { NumericFormat } from 'react-number-format';
import { extractList } from '@/shared/utils/apiResponse';
import { useAuth } from '@/modules/auth/context';

export default function ItemCreate() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoryLists(token);
        const data = extractList(response);
        setCategories(data);
        // because your API likely returns pagination
      } catch (err) {
        await alertError(err.response?.data?.message || err.message);
      }
    }

    if (token) fetchCategories();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const payload = {
      name,
      sku,
      selling_price: sellingPrice,
      cost_price: costPrice,
      stock,
      unit,
      category_id: categoryId,
    };

    try {
      const response = await itemCreate(token, payload);

      if (response.status === 201) {
        await alertSuccess('Item created successfully');
        navigate('/items');
      } else {
        await alertError(response.data.message || 'Failed to create item');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-4">Create Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Item Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">SKU</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        {/* CATEGORY SELECT */}
        <div>
          <label className="label">Category</label>
          <select
            className="select select-bordered w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Selling Price</label>
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            className="input input-bordered w-full"
            value={sellingPrice}
            onValueChange={(values) => setSellingPrice(values.value)}
            required
          />
        </div>

        <div>
          <label className="label">Cost Price</label>
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            className="input input-bordered w-full"
            value={costPrice}
            onValueChange={(values) => setCostPrice(values.value)}
          />
        </div>

        <div>
          <label className="label">Stock</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            required
          />
        </div>

        <div>
          <label className="label">Unit</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/items" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
