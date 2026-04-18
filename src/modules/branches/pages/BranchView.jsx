import { Link, useNavigate, useParams } from 'react-router-dom';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useBranch } from '../hooks';

export default function BranchView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: branch, isLoading, error } = useBranch(id);

  if (isLoading) return <FormSkeleton rows={5} />;

  if (error) {
    navigate('/branches');
    return null;
  }

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
