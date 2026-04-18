import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateCompany } from '../hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';

const COMPANY_TYPES = [
  'Retail',
  'F&B / Restaurant',
  'Pharmacy',
  'Services',
  'Other',
];

export default function CompanyCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateCompany();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    is_active: true,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    createMutation.mutate(form, {
      onSuccess: async () => {
        await alertSuccess('Company created successfully');
        navigate('/companies');
      },
      onError: async (err) => {
        await alertError(err.response?.data?.message || err.message);
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-6">Create Company</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Company Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Toko Maju Jaya"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
          <p className="text-xs opacity-50 mt-1">
            Code will be generated automatically from the name.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="company@email.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="+62 812 xxxx xxxx"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Address</label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Company address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>

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
          <Link to="/companies" className="btn btn-outline">
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