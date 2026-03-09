import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegister from './views/User/UserRegister';
import UserLogin from './views/User/UserLogin';
import UserLogout from './views/User/UserLogout';
import VerifyEmail from './views/User/VerifyEmail';
import { AuthProvider } from './lib/context/AuthContext';
import EmployeeCreate from './views/employees/EmployeeCreate';
import './index.css';
import BaseLayout from './views/layouts/BaseLayout';
// import POSLayout from './views/layouts/POSLayout';
import EmployeeEdit from './views/employees/EmployeeEdit';
import EmployeeView from './views/employees/EmployeeView';
import EmployeeList from './views/employees/EmployeeList';
import ItemList from './views/items/ItemList';
import ItemCreate from './views/items/ItemCreate';
import ItemEdit from './views/items/ItemEdit';
import ItemView from './views/items/ItemView';
import OrderList from './views/orders/OrderList';
import OrderCreate from './views/orders/OrderCreate';
import OrderView from './views/orders/OrderView';
import CategoryList from './views/categories/CategoryList';
import CategoryCreate from './views/categories/CategoryCreate';
import CategoryEdit from './views/categories/CategoryEdit';
import CategoryView from './views/categories/CategoryView';
import CompanyList from './views/companies/CompanyList';
import CompanyCreate from './views/companies/CompanyCreate';
import CompanyEdit from './views/companies/CompanyEdit';
import CompanyView from './views/companies/CompanyView';
import BranchList from './views/branches/BranchList';
import BranchCreate from './views/branches/BranchCreate';
import BranchEdit from './views/branches/BranchEdit';
import BranchView from './views/branches/BranchView';
import SubCategoryList from './views/subcategories/SubCategoryList';
import SubCategoryCreate from './views/subcategories/SubCategoryCreate';
import SubCategoryEdit from './views/subcategories/SubCategoryEdit';
import SubCategoryView from './views/subcategories/SubCategoryView';
import UserList from './views/users/UserList';
import UserCreate from './views/users/UserCreate';
import UserEdit from './views/users/UserEdit';
import UserView from './views/users/UserView';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route index path="/" element={<UserLogin />} />
          <Route path="register" element={<UserRegister />} />
          <Route path="verify-email" element={<VerifyEmail />} />

          {/* POS — sidebar only, no navbar */}
          {/* <Route path="/" element={<POSLayout />}> */}
          <Route path="pos/:id" element={<OrderCreate />} />
          <Route path="pos/:id/view" element={<OrderView />} />
          {/* </Route> */}

          {/* App — full layout */}
          <Route path="/" element={<BaseLayout />}>
            {/* <Route path="employees">
              <Route index element={<EmployeeList />} />
              <Route path="create" element={<EmployeeCreate />} />
              <Route path=":id/edit" element={<EmployeeEdit />} />
              <Route path=":id" element={<EmployeeView />} />
            </Route> */}
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
            <Route path="pos">
              <Route index element={<OrderList />} />
            </Route>
            <Route path="logout" element={<UserLogout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;