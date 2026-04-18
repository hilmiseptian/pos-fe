import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useBranch, useUpdateBranch } from '../hooks';

export default function BranchEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateBranch();

  const { data: branch, isLoading, error } = useBranch(id);

  const [form, setForm] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    is_active: true,
  });

  useEffect(() => {
    if (!branch) return;
    setForm({
      name: branch.name ?? '',
      code: branch.code ?? '',
      city: branch.city ?? '',
      address: branch.address ?? '',
      is_active: branch.is_active ?? true,
    });
  }, [branch]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    updateMutation.mutate(
      { id: Number(id), ...form },
      {
        onSuccess: async () => {
          await alertSuccess('Branch updated successfully');
          navigate('/branches');
        },
        onError: async (err) => {
          await alertError(err.response?.data?.message || err.message);
        },
      },
    );
  }

  if (isLoading) return <FormSkeleton rows={5} />;
  if (error) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Branch</h2>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />

        <label className="label">Code</label>
        <input
          type="text"
          name="code"
          className="input input-bordered w-full"
          value={form.code}
          onChange={(e) => set('code', e.target.value)}
          required
        />

        <label className="label">City</label>
        <input
          type="text"
          name="city"
          className="input input-bordered w-full"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
        />

        <label className="label">Address</label>
        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={form.is_active}
            onChange={(e) => set('is_active', e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/branches" className="btn btn-outline">
            Cancel
          </Link>
          <button
            className="btn btn-primary"
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
