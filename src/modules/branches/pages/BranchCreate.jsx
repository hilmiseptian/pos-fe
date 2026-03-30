import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { branchCreate } from '../api';
import { useLocalStorage } from 'react-use';

export default function BranchCreate() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    is_active: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
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

    try {
      setLoading(true);
      const response = await branchCreate(token, {
        ...form,
        is_active: Boolean(form.is_active),
      });

      if (response.status === 201) {
        await alertSuccess('Branch created successfully');
        navigate('/branches');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-4">Create Branch</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          className="input input-bordered w-full"
          placeholder="Branch Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="code"
          className="input input-bordered w-full"
          placeholder="Branch Code"
          value={form.code}
          onChange={handleChange}
          required
        />

        <input
          name="city"
          className="input input-bordered w-full"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-3">
          <input
            type="checkbox"
            name="is_active"
            className="checkbox"
            checked={form.is_active}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/branches" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
