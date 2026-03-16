import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '@/lib/utils/alert';
import { branchDetail } from '@/lib/api/BranchApi';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function BranchView() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchBranch() {
    try {
      setLoading(true);
      const response = await branchDetail(token, { id });
      setBranch(response.data.data);
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

  if (loading) return <FormSkeleton rows={5} />;
  if (!branch) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Branch Detail</h2>

      <div className="space-y-3">
        <div>
          <span className="font-bold">Name:</span> {branch.name}
        </div>
        <div>
          <span className="font-bold">Code:</span> {branch.code || '-'}
        </div>
        <div>
          <span className="font-bold">City:</span> {branch.city || '-'}
        </div>
        <div>
          <span className="font-bold">Address:</span> {branch.address || '-'}
        </div>
        <div>
          <span className="font-bold">Status:</span>{' '}
          <span
            className={`badge ${branch.is_active ? 'badge-success' : 'badge-error'}`}>
            {branch.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Link to="/branches" className="btn btn-outline">
          Back
        </Link>
        <Link to={`/branches/${branch.id}/edit`} className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}