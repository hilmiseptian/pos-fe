import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/lib/utils/alert';
import { employeeDetail, employeeUpdate } from '@/lib/api/EmployeeApi';
import { NumericFormat } from 'react-number-format';
import FormSkeleton from '@/views/components/FormSkeleton';

export default function EmployeeEdit() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    name: '',
    employee_code: '',
    position: '',
    department: '',
    salary: '',
    hire_date: '',
    status: 'active',
  });

  const { id } = useParams();
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');

  async function fetchEmployee() {
    try {
      setLoading(true);
      const response = await employeeDetail(token, { id });
      const { data } = response.data;
      setEmployee({
        name: data.name || '',
        employee_code: data.employee_code || '',
        position: data.position || '',
        department: data.department || '',
        salary: data.salary || '',
        hire_date: data.hire_date || '',
        status: data.status || 'active',
      });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const formData = new FormData();
    for (const key in employee) {
      formData.append(key, employee[key]);
    }
    formData.append('_method', 'PATCH');

    try {
      setLoading(true);
      const response = await employeeUpdate(token, id, formData);
      await alertSuccess(
        response.data.message || 'Employee updated successfully'
      );
      navigate('/employees');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FormSkeleton rows={5} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Employee</h2>

          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            placeholder="Employee name"
            value={employee.name}
            onChange={handleChange}
          />

          <label className="label">Position</label>
          <input
            type="text"
            name="position"
            className="input input-bordered w-full"
            placeholder="e.g. Software Engineer"
            value={employee.position}
            onChange={handleChange}
          />

          <label className="label">Department</label>
          <input
            type="text"
            name="department"
            className="input input-bordered w-full"
            placeholder="e.g. IT, Finance, HR"
            value={employee.department}
            onChange={handleChange}
          />

          <label className="label">Salary</label>
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            className="input input-bordered w-full"
            value={employee.salary}
            onValueChange={(values) => setSalary(values.value)} // raw numeric value
            placeholder="Input sallary..."
            required
          />

          <label className="label">Hire Date</label>
          <input
            type="date"
            name="hire_date"
            className="input input-bordered w-full"
            value={employee.hire_date || ''}
            onChange={handleChange}
          />

          <label className="label">Status</label>
          <select
            name="status"
            className="select select-bordered w-full"
            value={employee.status}
            onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>

          <div className="flex justify-end gap-2 mt-6">
            <Link to="/employees" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
