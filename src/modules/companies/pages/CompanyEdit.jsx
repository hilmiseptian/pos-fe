import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCompany, useUpdateCompany } from '../hooks';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateCompany();

  const { data: company, isLoading, error } = useCompany(id);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    is_active: true,
  });

  useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name ?? '',
      email: company.email ?? '',
      phone: company.phone ?? '',
      address: company.address ?? '',
      is_active: company.is_active ?? true,
    });
  }, [company]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    updateMutation.mutate(
      { id: Number(id), ...form },
      {
        onSuccess: async () => {
          await alertSuccess('Company updated successfully');
          navigate('/companies');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (isLoading) return <FormSkeleton rows={5} />;

  if (error) {
    navigate('/companies');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Company</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Company Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>

        {/* Code shown read-only — immutable after creation */}
        <div>
          <label className="label">
            Code{' '}
            <span className="text-xs opacity-50 ml-1">
              (auto-generated, read only)
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full font-mono opacity-60"
            value={company?.code ?? ''}
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Address</label>
          <textarea
            className="textarea textarea-bordered w-full"
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
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
