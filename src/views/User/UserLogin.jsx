import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { AtSign, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { userLogin } from '../../lib/api/UserApi';
import { useAuth } from '@/lib/context/AuthContext';

export default function UserLogin() {
  const navigate = useNavigate();
  const { setToken } = useAuth(); // ← use AuthContext
  const [, setUser] = useLocalStorage('user', null);

  const [form, setForm] = useState({ login: '', password: '' });
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
    if (!form.login || !form.password) {
      setError('Please enter your email or username and password.');
      return;
    }
    try {
      setLoading(true);
      const res = await userLogin(form);

      setToken(res.data.token); // ← updates AuthContext state
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
                Some features may be limited. Please check your inbox.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error rounded-xl mb-4 py-3">
            <AlertTriangle size={16} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Email / Username */}
          <label className="input input-bordered flex items-center gap-2">
            <AtSign size={16} className="opacity-40" />
            <input
              type="text"
              className="grow"
              placeholder="Email or username"
              value={form.login}
              onChange={(e) => set('login', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </label>

          {/* Password */}
          <label className="input input-bordered flex items-center gap-2">
            <Lock size={16} className="opacity-40" />
            <input
              type={showPass ? 'text' : 'password'}
              className="grow"
              placeholder="Password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="opacity-40 hover:opacity-70">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </label>

          <button
            className="btn btn-primary w-full"
            onClick={handleLogin}
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm opacity-60">
            Don't have an account?{' '}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}