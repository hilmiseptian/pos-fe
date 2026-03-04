import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userLogin } from '@/lib/api/UserApi.js';
import { alertError, alertSuccess } from '@/lib/utils/alert.js';
import { useAuth } from '@/lib/context/AuthContext.jsx';

export default function UserLogin() {
  const [email, setEmail] = useState('admin@mail.com');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await userLogin({ email, password });
      const { token, message } = response.data;

      setToken(token);
      await alertSuccess(message);
      navigate('/employees');
    } catch (err) {
      await alertError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="relative flex flex-col justify-center h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-700">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Email Address"
              className="w-full input input-bordered"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-block">
              Sign In
            </button>
          </div>
          <span>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 hover:underline">
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
