import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegister from './views/User/UserRegister';
import UserLogin from './views/User/UserLogin';
import UserLogout from './views/User/UserLogout';
import { AuthProvider } from './lib/context/AuthContext';
import EmployeeCreate from './views/employees/EmployeeCreate';
import './index.css';
import BaseLayout from './views/layouts/BaseLayout';
import EmployeeEdit from './views/employees/EmployeeEdit';
import EmployeeView from './views/employees/EmployeeView';
import EmployeeList from './views/employees/EmployeeList';
import ItemList from './views/items/ItemList';
import ItemCreate from './views/items/ItemCreate';
import ItemEdit from './views/items/ItemEdit';
import ItemView from './views/items/ItemView';
import OrderList from './views/orders/OrderList';
import CategoryList from './views/categories/CategoryList';
import CategoryCreate from './views/categories/CategoryCreate';
import CategoryEdit from './views/categories/CategoryEdit';
import CategoryView from './views/categories/CategoryView';
import CompanyList from './views/companies/CompanyList';
import CompanyCreate from './views/companies/CompanyCreate';
import CompanyEdit from './views/companies/CompanyEdit';
import CompanyView from './views/companies/CompanyView';
function App() {
  return (
    // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path="/" element={<UserLogin />} />
          <Route path="register" element={<UserRegister />} />
          <Route path="/" element={<BaseLayout />}>
            <Route path="employees">
              <Route index element={<EmployeeList />} />
              <Route path="create" element={<EmployeeCreate />} />
              <Route path=":id/edit" element={<EmployeeEdit />} />
              <Route path=":id" element={<EmployeeView />} />
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
            <Route path="companies">
              <Route index element={<CompanyList />} />
              <Route path="create" element={<CompanyCreate />} />
              <Route path=":id/edit" element={<CompanyEdit />} />
              <Route path=":id" element={<CompanyView />} />
            </Route>
            <Route path="orders">
              <Route index element={<OrderList />} />
              {/* <Route path="create" element={<ItemCreate />} />
              <Route path=":id/edit" element={<ItemEdit />} />
              <Route path=":id" element={<ItemView />} /> */}
            </Route>
            <Route path="logout" element={<UserLogout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    // </React.StrictMode>
  );
}
export default App;
