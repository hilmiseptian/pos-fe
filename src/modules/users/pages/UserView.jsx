import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { alertError } from '@/shared/utils/alert';
import { userDetail } from '../api';
import FormSkeleton from '@/shared/components/FormSkeleton';
import { useAuth } from '@/modules/auth/context';

const ROLE_BADGE = {
  owner: 'badge-success',
  admin: 'badge-info',
  cashier: 'badge-warning',
};

export default function UserView() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchUser() {
    try {
      setLoading(true);
      const response = await userDetail(token, { id });
      setUser(response.data.data);
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchUser();
  });

  if (loading) return <FormSkeleton rows={5} />;

  if (!user) {
    return (
      <div className="text-center mt-10 text-error font-semibold">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-base-200 px-6 mt-6 mb-6 rounded-box shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <p>
            <span className="font-bold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-bold">Username:</span> @{user.username}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {user.phone || '-'}
          </p>
          <p>
            <span className="font-bold">Role:</span>{' '}
            <span
              className={`badge badge-sm ${ROLE_BADGE[user.role] ?? 'badge-ghost'}`}>
              {user.role}
            </span>
          </p>
          <p>
            <span className="font-bold">Status:</span>{' '}
            <span
              className={`badge badge-sm ${user.is_active ? 'badge-success' : 'badge-error'}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </p>
          <p>
            <span className="font-bold">Email Verified:</span>{' '}
            <span
              className={`badge badge-sm ${user.email_verified_at ? 'badge-success' : 'badge-warning'}`}>
              {user.email_verified_at ? 'Verified' : 'Not verified'}
            </span>
          </p>
        </div>

        <div>
          <p className="font-bold mb-2">Assigned Branches:</p>
          {user.branches?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {user.branches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-base-300 bg-base-100">
                  <div>
                    <p className="text-sm font-medium">{branch.name}</p>
                    <p className="text-xs opacity-50">
                      {branch.city || '-'} · {branch.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-50">No branches assigned.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Link to="/users" className="btn btn-outline">
          Back
        </Link>
        <Link to={`/users/${user.id}/edit`} className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
