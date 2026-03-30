import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { branchDetail, branchUpdate } from '../api';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function BranchEdit() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);

  const [branch, setBranch] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    is_active: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchBranch() {
    try {
      setLoading(true);
      const response = await branchDetail(token, { id });
      const { data } = response.data;

      setBranch({
        name: data.name || '',
        code: data.code || '',
        city: data.city || '',
        address: data.address || '',
        is_active: data.is_active ?? true,
      });
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchBranch();
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranch((prev) => ({
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
      const response = await branchUpdate(token, id, {
        ...branch,
        _method: 'PUT',
        is_active: Boolean(branch.is_active),
      });
      await alertSuccess(
        response.data.message || 'Branch updated successfully',
      );
      navigate('/branches');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FormSkeleton rows={5} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Branch</h2>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={branch.name}
          onChange={handleChange}
          required
        />

        <label className="label">Code</label>
        <input
          type="text"
          name="code"
          className="input input-bordered w-full"
          value={branch.code}
          onChange={handleChange}
          required
        />

        <label className="label">City</label>
        <input
          type="text"
          name="city"
          className="input input-bordered w-full"
          value={branch.city}
          onChange={handleChange}
        />

        <label className="label">Address</label>
        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          value={branch.address}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={branch.is_active}
            onChange={handleChange}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/branches" className="btn btn-outline">
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
