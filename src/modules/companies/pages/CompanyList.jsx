import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess, alertConfirm } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';
import { useCompaniesPaginated, useDeleteCompany } from '../hooks';

export default function CompanyList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCompaniesPaginated(page);
  const deleteMutation = useDeleteCompany();

  const companies = data?.data ?? [];
  const meta = data?.meta;

  if (error) {
    navigate('/');
    return null;
  }

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm('Want to delete this company?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('Company deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  };

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

            {isLoading ? (
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

          {meta && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
