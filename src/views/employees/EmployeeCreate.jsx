import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/lib/utils/alert';
import { employeeCreate } from '@/lib/api/EmployeeApi';
import { useLocalStorage } from 'react-use';
import { NumericFormat } from 'react-number-format';

export default function EmployeeCreate() {
  const [token] = useLocalStorage('token', '');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [hireDate, setHireDate] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // const token = localStorage.getItem('token');

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const payload = { name, position, department, salary, hire_date: hireDate };

    try {
      const response = await employeeCreate(token, payload);
      if (response.status === 201) {
        await alertSuccess('Employee created successfully');
        navigate('/employees');
      } else {
        await alertError(response.data.message || 'Failed to create employee');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Position</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Department</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Salary</label>

          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            className="input input-bordered w-full"
            value={salary}
            onValueChange={(values) => setSalary(values.value)} // raw numeric value
            placeholder="Input sallary..."
            required
          />
        </div>

        <div>
          <label className="label">Hire Date</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/employees" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
