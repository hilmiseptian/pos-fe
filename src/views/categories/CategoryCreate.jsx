import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '../../lib/util/alert';
import { categoryCreate } from '../../lib/api/CategoryApi';
import { useLocalStorage } from 'react-use';

export default function CategoryCreate() {
  const [token] = useLocalStorage('token', '');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isActive, setIsActive] = useState(true);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const payload = {
      name,
      code,
      sort_order: sortOrder,
      is_active: isActive,
    };

    try {
      const response = await categoryCreate(token, payload);

      if (response.status === 201) {
        await alertSuccess('Category created successfully');
        navigate('/categories');
      } else {
        await alertError(response.data.message || 'Failed to create category');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-4">Create Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Category Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Code</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Sort Order</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            min="0"
          />
        </div>

        <div>
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/categories" className="btn btn-outline">
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
