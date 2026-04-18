import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBranchesPaginated, useDeleteBranch } from '../hooks';
import { alertConfirm, alertError, alertSuccess } from '@/shared/utils/alert';
import Pagination from '@/shared/components/Pagination';
import SkeletonTable from '@/shared/components/SkeletonTable';

export default function BranchList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBranchesPaginated(page);
  const deleteMutation = useDeleteBranch();

  const branches = data?.data ?? [];
  const meta = data?.meta;

  async function handleDelete(id) {
    const confirmed = await alertConfirm('Want to delete this branch?');
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alertSuccess('Branch deleted successfully'),
      onError: (err) => alertError(err.response?.data?.message || err.message),
    });
  }

  return (
    <>
      <h1 className="text-green-600 text-3xl font-bold text-center my-6">
        Branch Management
      </h1>

      <div className="flex justify-between items-center max-w-6xl mx-auto mb-4">
        <h2 className="text-xl font-bold">Branch List</h2>
        <Link to="/branches/create" className="btn btn-primary">
          + Add Branch
        </Link>
      </div>

      <div className="max-w-6xl mx-auto py-8 bg-base-200 px-4 mt-4 mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>City</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {isLoading ? (
              <SkeletonTable rows={8} />
            ) : (
              <tbody>
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <tr key={branch.id}>
                      <td className="font-bold">{branch.name}</td>
                      <td className="font-mono text-sm">{branch.code}</td>
                      <td>{branch.city || '-'}</td>
                      <td>{branch.address || '-'}</td>
                      <td>
                        <span
                          className={`badge ${branch.is_active ? 'badge-success' : 'badge-error'}`}>
                          {branch.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <Link
                          to={`/branches/${branch.id}`}
                          className="btn btn-xs btn-info">
                          View
                        </Link>
                        <Link
                          to={`/branches/${branch.id}/edit`}
                          className="btn btn-xs btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          disabled={deleteMutation.isPending}
                          className="btn btn-xs btn-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center opacity-50 py-8">
                      No branches found.
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