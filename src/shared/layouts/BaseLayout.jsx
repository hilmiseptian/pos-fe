import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/context';
import {
  Building,
  Calculator,
  Store,
  StretchHorizontal,
  TableProperties,
  Users,
  ShieldCheck,
  UserCircle,
  Gauge,
} from 'lucide-react';
import { SidebarSkeleton } from '../components/SideBarSkeleton';

export default function BaseLayout() {
  const { token, user, can, isLoading } = useAuth();
  if (!token) return <Outlet />;
  if (!isLoading) return <SidebarSkeleton />;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <Gauge size={16} />,
    },
    {
      to: '/pos',
      label: 'Point of Sales',
      icon: <Calculator size={16} />,
      permission: 'orders.view',
    },
    {
      to: '/users',
      label: 'Users',
      icon: <Users size={16} />,
      permission: 'users.view',
    },
    {
      to: '/roles',
      label: 'Roles',
      icon: <ShieldCheck size={16} />,
      permission: 'roles.view',
    },
    {
      to: '/items',
      label: 'Items',
      icon: <StretchHorizontal size={16} />,
      permission: 'items.view',
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: <TableProperties size={16} />,
      permission: 'categories.view',
    },
    {
      to: '/sub-categories',
      label: 'Sub Categories',
      icon: <TableProperties size={16} />,
      permission: 'subcategories.view',
    },
    {
      to: '/branches',
      label: 'Branches',
      icon: <Store size={16} />,
      permission: 'branches.view',
    },
    {
      to: '/companies',
      label: 'Company',
      icon: <Building size={16} />,
      permission: 'companies.view',
    },
  ];

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

          {/* Company name */}
          <div className="px-4 font-semibold">
            {user?.company?.name ?? 'POS System'}
          </div>

          {/* Logged-in user info */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <UserCircle size={18} />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">{user?.name}</span>
                <span className="text-xs opacity-60">
                  {user?.role_name ?? user?.role}
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

      {/* Sidebar — only show items user has permission to see */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <div className="flex min-h-full w-52 flex-col bg-base-200">
          <ul className="menu w-full">
            {navItems.map(({ to, label, icon, permission }) =>
              can(permission) ? (
                <li key={to}>
                  <Link to={to}>
                    {icon}
                    {label}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
