import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '../../lib/util/alert';
import { companyDetail } from '../../lib/api/CompanyApi';
import FormSkeleton from '../components/FormSkeleton';

export default function CompanyView() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCompany() {
    try {
      setLoading(true);
      const response = await companyDetail(token, { id });
      setCompany(response.data.data);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchCompany();
  });

  if (loading) return <FormSkeleton rows={5} />;
  if (!company) return null;

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
