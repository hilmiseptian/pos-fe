import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError } from '@/lib/utils/alert';
import { employeeDetail } from '@/lib/api/EmployeeApi';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function EmployeeView() {
  const [token] = useLocalStorage('token', '');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');

  async function fetchEmployee() {
    try {
      setLoading(true);
      const response = await employeeDetail(token, { id });
      const { data } = response.data;
      setEmployee(data);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchEmployee();
  });

  if (loading) return <FormSkeleton rows={5} />;

  if (!employee) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Employee not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Employee Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-3">
            <span className="font-bold">Name:</span> {employee.name}
          </p>
          <p className="mb-3">
            <span className="font-bold">Position:</span> {employee.position}
          </p>
          <p className="mb-3">
            <span className="font-bold">Department:</span>{' '}
            {employee.department || '-'}
          </p>
          <p className="mb-3">
            <span className="font-bold">Salary:</span> $
            {parseFloat(employee.salary).toLocaleString()}
          </p>
          <p className="mb-3">
            <span className="font-bold">Hire Date:</span>{' '}
            {employee.hire_date || '-'}
          </p>
          <p className="mb-3">
            <span className="font-bold">Status:</span>{' '}
            <span
              className={`badge ${
                employee.status === 'active'
                  ? 'badge-success'
                  : employee.status === 'inactive'
                  ? 'badge-warning'
                  : 'badge-error'
              }`}>
              {employee.status}
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Link to="/employees" className="btn btn-outline">
          Back
        </Link>
        <Link to={`/employees/${employee.id}/edit`} className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
