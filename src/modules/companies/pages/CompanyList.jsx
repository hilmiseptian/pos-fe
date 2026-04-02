import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { alertError, alertSuccess, alertConfirm } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';
import { companyDelete, companyLists } from '../api';
import { useAuth } from '@/modules/auth/context';

export default function CompanyList() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchCompanies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await companyLists(token, { page });
      setCompanies(response.data.data);
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
    const confirmed = await alertConfirm('Want to delete this company?');
    if (!confirmed) return;

    try {
      const response = await companyDelete(token, { id });
      await alertSuccess(
        response.data.message || 'Company deleted successfully',
      );
      fetchCompanies(currentPage);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  };

  useEffectOnce(() => {
    fetchCompanies();
  });

  return (
    <>
      <h1 className="text-green-600 text-3xl font-bold text-center my-6">
        Company Management
      </h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Company List</h2>
        <Link to="/companies/create" className="btn btn-primary">
          + Add Company
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {loading ? (
              <SkeletonTable cols={5} />
            ) : (
              <tbody>
                {companies.length > 0 ? (
                  companies.map((cmp) => (
                    <tr key={cmp.id}>
                      <td className="font-bold">{cmp.name}</td>
                      <td>{cmp.code}</td>
                      <td>{cmp.email || '-'}</td>
                      <td>{cmp.phone || '-'}</td>
                      <td>
                        <span
                          className={`badge ${
                            cmp.is_active ? 'badge-success' : 'badge-error'
                          }`}>
                          {cmp.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Link
                          to={`/companies/${cmp.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/companies/${cmp.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(cmp.id)}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={fetchCompanies}
          />
        </div>
      </div>
    </>
  );
}
