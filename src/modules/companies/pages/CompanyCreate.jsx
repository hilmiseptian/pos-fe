import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { companyCreate } from '../api';
import { useLocalStorage } from 'react-use';

export default function CompanyCreate() {
  const [token] = useLocalStorage('token', '');
  const [form, setForm] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
    is_active: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
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

    try {
      const response = await companyCreate(token, form);

      if (response.status === 201) {
        await alertSuccess('Company created successfully');
        navigate('/companies');
      }
    } catch (err) {
      await alertError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <h2 className="text-xl font-semibold mb-4">Create Company</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          className="input input-bordered w-full"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="code"
          className="input input-bordered w-full"
          placeholder="Company Code"
          value={form.code}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          className="input input-bordered w-full"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          className="input input-bordered w-full"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <label className="label cursor-pointer gap-3">
          <input
            type="checkbox"
            name="is_active"
            className="checkbox"
            checked={form.is_active}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/companies" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
