import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { userLogin } from '../../lib/api/UserApi';

export default function UserLogin() {
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage('token', '');
  const [, setUser] = useLocalStorage('user', null);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unverified, setUnverified] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setUnverified(false);
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const res = await userLogin(form);
      setToken(res.data.token);
      setUser(JSON.stringify(res.data.user));

      if (!res.data.email_verified) {
        setUnverified(true);
        return;
      }

      navigate('/pos');
    } catch (err) {
      setError(
        err.response?.data?.message ?? 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl shadow-lg w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-1">Welcome Back</h1>
        <p className="text-sm text-center opacity-50 mb-6">
          Sign in to your POS
        </p>

        {unverified && (
          <div className="alert alert-warning rounded-xl mb-4 py-3">
            <AlertTriangle size={16} className="shrink-0" />
            <div>
              <p className="text-sm font-medium">Email not verified</p>
              <p className="text-xs opacity-80">
                Some features may be limited.{' '}
                <Link to="/verify-email" className="underline font-semibold">
                  Verify now
                </Link>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error rounded-xl mb-4 py-2">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <label className="input input-bordered flex items-center gap-2 rounded-xl">
              <Mail size={15} className="opacity-40" />
              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="grow text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <label className="input input-bordered flex items-center gap-2 rounded-xl">
              <Lock size={15} className="opacity-40" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Your password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="grow text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="opacity-40 hover:opacity-70">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </label>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn btn-primary w-full rounded-xl mt-1">
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <p className="text-sm text-center mt-4 opacity-60">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
