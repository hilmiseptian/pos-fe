import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Building,
  Calculator,
  Store,
  StretchHorizontal,
  TableProperties,
  Users,
  UserCircle,
} from 'lucide-react';

export default function BaseLayout() {
  const { token, user } = useAuth();

  if (!token) return <Outlet />;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="inline-block size-4">
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4v16" />
              <path d="M14 10l2 2l-2 2" />
            </svg>
          </label>

          {/* Company name as title */}
          <div className="px-4 font-semibold">
            {user?.company?.name ?? 'POS System'}
          </div>

          {/* Logged-in user info + logout */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <UserCircle size={18} />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">{user?.name}</span>
                <span className="text-xs opacity-60 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
            <Link to="/logout" className="btn btn-sm btn-outline">
              Logout
            </Link>
          </div>
        </nav>

        {/* Page content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="flex min-h-full w-48 flex-col bg-base-200">
          <ul className="menu w-full">
            <li>
              <Link to="/users">
                <Users />
                Users
              </Link>
            </li>
            <li>
              <Link to="/pos">
                <Calculator />
                Point of Sales
              </Link>
            </li>
            <li>
              <Link to="/items">
                <StretchHorizontal />
                Items
              </Link>
            </li>
            <li>
              <Link to="/categories">
                <TableProperties />
                Categories
              </Link>
            </li>
            <li>
              <Link to="/sub-categories">
                <TableProperties />
                Sub Categories
              </Link>
            </li>
            <li>
              <Link to="/companies">
                <Building />
                Company
              </Link>
            </li>
            <li>
              <Link to="/branches">
                <Store />
                Branch
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}