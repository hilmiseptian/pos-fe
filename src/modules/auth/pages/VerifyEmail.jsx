import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react';
import { userResendVerification } from '../api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [token, , removeToken] = useAuth();
  const [user] = useLocalStorage('user', null);

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState(null);

  const parsedUser = user ? JSON.parse(user) : null;

  async function handleResend() {
    try {
      setResending(true);
      setError(null);
      setResendSuccess(false);
      await userResendVerification(token);
      setResendSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ?? 'Failed to resend. Please try again.',
      );
    } finally {
      setResending(false);
    }
  }

  function handleLogout() {
    removeToken();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-primary" />
        </div>

        <h1 className="text-xl font-bold mb-2">Check Your Email</h1>
        <p className="text-sm opacity-60 leading-relaxed mb-1">
          We sent a verification link to
        </p>
        {parsedUser?.email && (
          <p className="text-sm font-semibold text-primary mb-4">
            {parsedUser.email}
          </p>
        )}
        <p className="text-sm opacity-60 leading-relaxed mb-6">
          Click the link in the email to verify your account and get started.
        </p>

        {resendSuccess && (
          <div className="alert alert-success rounded-xl py-2 mb-4">
            <CheckCircle size={15} />
            <span className="text-sm">Verification email resent!</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error rounded-xl py-2 mb-4">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleResend}
            disabled={resending}
            className="btn btn-primary btn-sm w-full rounded-xl gap-2">
            {resending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <RefreshCw size={14} />
            )}
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm w-full rounded-xl gap-2 text-error hover:bg-error/10">
            <LogOut size={14} />
            Logout & use different account
          </button>
        </div>

        <p className="text-xs opacity-40 mt-4">
          Didn't receive it? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
