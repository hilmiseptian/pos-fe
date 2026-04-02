import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { subCategoryCreate } from '../api';
import { categoryLists } from '@/modules/categories/api';
import { useAuth } from '@/modules/auth/context';

export default function SubCategoryCreate() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isActive, setIsActive] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      if (!token) return;

      const res = await categoryLists(token);

      if (res.status === 200) {
        setCategories(res.data.data.data || []);
      }
    } catch (err) {
      await alertError('Failed to load categories');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    if (!categoryId) {
      await alertError('Category must be selected');
      return;
    }

    const payload = {
      category_id: categoryId,
      name,
      is_active: isActive,
    };

    try {
      const response = await subCategoryCreate(token, payload);

      if (response.status === 201) {
        await alertSuccess('Sub category created successfully');
        navigate('/sub-categories');
      } else {
        await alertError(
          response.data.message || 'Failed to create sub category',
        );
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-4">Create Sub Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Select */}
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

        {/* Name */}
        <div>
          <label className="label">Sub Category Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Active */}
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

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link to="/sub-categories" className="btn btn-outline">
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
