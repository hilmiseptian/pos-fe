import { Link, useNavigate, useParams } from 'react-router-dom';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useCompany } from '../hooks';

export default function CompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading, error } = useCompany(id);

  if (isLoading) return <FormSkeleton rows={5} />;

  if (error) {
    navigate('/companies');
    return null;
  }
  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Company Detail</h2>

      <div className="space-y-3">
        <div>
          <strong>Name:</strong> {company.name}
        </div>
        <div>
          <strong>Email:</strong> {company.email}
        </div>
        <div>
          <strong>Phone:</strong> {company.phone}
        </div>
        <div>
          <strong>Address:</strong> {company.address}
        </div>
        <div>
          <strong>Status:</strong> {company.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Link to="/companies" className="btn btn-outline">
          Back
        </Link>
      </div>
    </div>
  );
}
