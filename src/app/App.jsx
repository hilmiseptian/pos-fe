import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../index.css';

// ── Auth ───────────────────────────────────────────────────────────────────────
import { AuthProvider } from '@/modules/auth/context';
import Login from '@/modules/auth/pages/Login';
import Register from '@/modules/auth/pages/Register';
import Logout from '@/modules/auth/pages/Logout';
import VerifyEmail from '@/modules/auth/pages/VerifyEmail';

// ── Layout ─────────────────────────────────────────────────────────────────────
import BaseLayout from '@/shared/layouts/BaseLayout';

// ── Roles ──────────────────────────────────────────────────────────────────────
import RoleList from '@/modules/roles/pages/RoleList';
import RoleCreate from '@/modules/roles/pages/RoleCreate';
import RoleEdit from '@/modules/roles/pages/RoleEdit';
import RoleView from '@/modules/roles/pages/RoleView';

// ── Users ──────────────────────────────────────────────────────────────────────
import UserList from '@/modules/users/pages/UserList';
import UserCreate from '@/modules/users/pages/UserCreate';
import UserEdit from '@/modules/users/pages/UserEdit';
import UserView from '@/modules/users/pages/UserView';

// ── Items ──────────────────────────────────────────────────────────────────────
import ItemList from '@/modules/items/pages/ItemList';
import ItemCreate from '@/modules/items/pages/ItemCreate';
import ItemEdit from '@/modules/items/pages/ItemEdit';
import ItemView from '@/modules/items/pages/ItemView';

// ── Categories ─────────────────────────────────────────────────────────────────
import CategoryList from '@/modules/categories/pages/CategoryList';
import CategoryCreate from '@/modules/categories/pages/CategoryCreate';
import CategoryEdit from '@/modules/categories/pages/CategoryEdit';
import CategoryView from '@/modules/categories/pages/CategoryView';

// ── Sub Categories ─────────────────────────────────────────────────────────────
import SubCategoryList from '@/modules/subcategories/pages/SubCategoryList';
import SubCategoryCreate from '@/modules/subcategories/pages/SubCategoryCreate';
import SubCategoryEdit from '@/modules/subcategories/pages/SubCategoryEdit';
import SubCategoryView from '@/modules/subcategories/pages/SubCategoryView';

// ── Companies ──────────────────────────────────────────────────────────────────
import CompanyList from '@/modules/companies/pages/CompanyList';
import CompanyCreate from '@/modules/companies/pages/CompanyCreate';
import CompanyEdit from '@/modules/companies/pages/CompanyEdit';
import CompanyView from '@/modules/companies/pages/CompanyView';

// ── Branches ───────────────────────────────────────────────────────────────────
import BranchList from '@/modules/branches/pages/BranchList';
import BranchCreate from '@/modules/branches/pages/BranchCreate';
import BranchEdit from '@/modules/branches/pages/BranchEdit';
import BranchView from '@/modules/branches/pages/BranchView';

// ── Orders / POS ───────────────────────────────────────────────────────────────
import OrderList from '@/modules/orders/pages/OrderList';
import OrderCreate from '@/modules/orders/pages/OrderCreate';
import OrderView from '@/modules/orders/pages/OrderView';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ───────────────────────────────────────────────────── */}
          <Route index path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />

          {/* ── POS (no BaseLayout) ──────────────────────────────────────── */}
          <Route path="pos/:id" element={<OrderCreate />} />
          <Route path="pos/:id/view" element={<OrderView />} />

          {/* ── App (with BaseLayout) ────────────────────────────────────── */}
          <Route path="/" element={<BaseLayout />}>
            <Route path="roles">
              <Route index element={<RoleList />} />
              <Route path="create" element={<RoleCreate />} />
              <Route path=":id/edit" element={<RoleEdit />} />
              <Route path=":id" element={<RoleView />} />
            </Route>

            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="create" element={<UserCreate />} />
              <Route path=":id/edit" element={<UserEdit />} />
              <Route path=":id" element={<UserView />} />
            </Route>

            <Route path="items">
              <Route index element={<ItemList />} />
              <Route path="create" element={<ItemCreate />} />
              <Route path=":id/edit" element={<ItemEdit />} />
              <Route path=":id" element={<ItemView />} />
            </Route>

            <Route path="categories">
              <Route index element={<CategoryList />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path=":id/edit" element={<CategoryEdit />} />
              <Route path=":id" element={<CategoryView />} />
            </Route>

            <Route path="sub-categories">
              <Route index element={<SubCategoryList />} />
              <Route path="create" element={<SubCategoryCreate />} />
              <Route path=":id/edit" element={<SubCategoryEdit />} />
              <Route path=":id" element={<SubCategoryView />} />
            </Route>

            <Route path="companies">
              <Route index element={<CompanyList />} />
              <Route path="create" element={<CompanyCreate />} />
              <Route path=":id/edit" element={<CompanyEdit />} />
              <Route path=":id" element={<CompanyView />} />
            </Route>

            <Route path="branches">
              <Route index element={<BranchList />} />
              <Route path="create" element={<BranchCreate />} />
              <Route path=":id/edit" element={<BranchEdit />} />
              <Route path=":id" element={<BranchView />} />
            </Route>

            <Route path="pos" element={<OrderList />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
