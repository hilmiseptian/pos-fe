import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { useCreateBranch } from '../hooks';

export default function BranchCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateBranch();

  const [form, setForm] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    is_active: true,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    createMutation.mutate(form, {
      onSuccess: async () => {
        await alertSuccess('Branch created successfully');
        navigate('/branches');
      },
      onError: async (err) => {
        await alertError(err.response?.data?.message || err.message);
      },
    });
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
          onChange={(e) => set('name', e.target.value)}
          required
        />

        <input
          name="code"
          className="input input-bordered w-full"
          placeholder="Branch Code"
          value={form.code}
          onChange={(e) => set('code', e.target.value)}
          required
        />

        <input
          name="city"
          className="input input-bordered w-full"
          placeholder="City"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
        />

        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          placeholder="Address"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
        />

        <label className="label cursor-pointer gap-3">
          <input
            type="checkbox"
            name="is_active"
            className="checkbox"
            checked={form.is_active}
            onChange={(e) => set('is_active', e.target.value)}
          />
          <span>Active</span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/branches" className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
