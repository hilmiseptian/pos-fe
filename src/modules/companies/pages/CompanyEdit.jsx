import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce, useLocalStorage } from 'react-use';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { companyDetail, companyUpdate } from '../api';
import FormSkeleton from '@/shared/components/FormSkeleton';

export default function CompanyEdit() {
  const [token] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    is_active: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCompany() {
    try {
      setLoading(true);
      const response = await companyDetail(token, { id });
      const { data } = response.data;

      setCompany({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        is_active: data.is_active ?? true,
      });
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffectOnce(() => {
    fetchCompany();
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      await alertError('You must be logged in.');
      return;
    }

    const formData = new FormData();
    Object.keys(company).forEach((key) => {
      formData.append(key, company[key]);
    });

    formData.append('_method', 'PATCH');

    try {
      setLoading(true);
      const response = await companyUpdate(token, id, formData);
      await alertSuccess(
        response.data.message || 'Company updated successfully',
      );
      navigate('/companies');
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FormSkeleton rows={5} />;

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Company</h2>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={company.name}
          onChange={handleChange}
        />

        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          value={company.email}
          onChange={handleChange}
        />

        <label className="label">Phone</label>
        <input
          type="text"
          name="phone"
          className="input input-bordered w-full"
          value={company.phone}
          onChange={handleChange}
        />

        <label className="label">Address</label>
        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          value={company.address}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-2">
          <span>Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={company.is_active}
            onChange={handleChange}
          />
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/companies" className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
