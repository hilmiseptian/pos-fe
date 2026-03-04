import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { useLocalStorage } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/lib/utils/alert';
import Pagination from '@/views/components/Pagination';
import SkeletonTable from '@/views/components/SkeletonTable';
import { employeeDelete, employeeLists } from '@/lib/api/EmployeeApi';

export default function EmployeeList() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      const response = await employeeLists(token, { page });
      setEmployees(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      await alertError(error.response?.data?.message || error.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this employee?');
    if (!confirmed) return;

    try {
      const response = await employeeDelete(token, { id });
      await alertSuccess(
        response.data.message || 'Employee deleted successfully'
      );
      fetchEmployees(currentPage);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  };

  useEffectOnce(() => {
    fetchEmployees();
  });

  return (
    <>
      <h1 className="text-green-600 text-3xl font-bold text-center my-6">
        Employee Management
      </h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Employee List</h2>
        <Link to="/employees/create" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {loading ? (
              <SkeletonTable rows={8} />
            ) : (
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="font-bold">{emp.name}</td>
                      <td>{emp.position}</td>
                      <td>{emp.department || '-'}</td>
                      <td>${parseFloat(emp.salary).toLocaleString()}</td>
                      <td>{emp.hire_date || '-'}</td>
                      <td>
                        <span
                          className={`badge ${
                            emp.status === 'active'
                              ? 'badge-success'
                              : emp.status === 'inactive'
                              ? 'badge-warning'
                              : 'badge-error'
                          }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Link
                          to={`/employees/${emp.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={fetchEmployees}
          />
        </div>
      </div>
    </>
  );
}
