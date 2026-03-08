import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import {
  User,
  Mail,
  Lock,
  Building2,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
  Store,
} from 'lucide-react';
import { userRegister } from '../../lib/api/UserApi';

const STEPS = [
  { label: 'Account', icon: User },
  { label: 'Company', icon: Building2 },
  { label: 'Branch', icon: Store },
];

const COMPANY_TYPES = [
  'Retail',
  'F&B / Restaurant',
  'Pharmacy',
  'Services',
  'Other',
];

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center
                              border-2 transition-all duration-300
                              ${
                                done
                                  ? 'bg-primary border-primary text-primary-content'
                                  : active
                                    ? 'border-primary text-primary bg-primary/10'
                                    : 'border-base-300 text-base-content/30'
                              }`}>
                {done ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span
                className={`text-xs font-medium transition-colors
                                ${active ? 'text-primary' : done ? 'text-primary/70' : 'text-base-content/30'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-1 mb-5 transition-colors
                               ${i < current ? 'bg-primary' : 'bg-base-300'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function UserRegister() {
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage('token', '');
  const [, setUser] = useLocalStorage('user', null);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company_name: '',
    company_type: '',
    branch_name: '',
    branch_city: '',
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email))
        e.email = 'Enter a valid email';
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 8) e.password = 'At least 8 characters';
      if (form.password !== form.password_confirmation)
        e.password_confirmation = 'Passwords do not match';
    }
    if (s === 1) {
      if (!form.company_name.trim())
        e.company_name = 'Company name is required';
      if (!form.company_type) e.company_type = 'Please select a type';
    }
    if (s === 2) {
      if (!form.branch_name.trim()) e.branch_name = 'Branch name is required';
      if (!form.branch_city.trim()) e.branch_city = 'City is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!validateStep(2)) return;
    try {
      setLoading(true);
      const res = await userRegister(form);
      setToken(res.data.token);
      setUser(JSON.stringify(res.data.user));
      navigate('/verify-email');
    } catch (err) {
      const serverErrors = err.response?.data?.errors ?? {};
      const message = err.response?.data?.message ?? 'Registration failed.';
      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
        const step1Fields = [
          'name',
          'email',
          'password',
          'password_confirmation',
        ];
        const step2Fields = ['company_name', 'company_type'];
        if (step1Fields.some((f) => serverErrors[f])) setStep(0);
        else if (step2Fields.some((f) => serverErrors[f])) setStep(1);
        else setStep(2);
      } else {
        setErrors({ general: message });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="bg-base-100 rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-sm text-center opacity-50 mb-6">
          Set up your POS in minutes
        </p>

        <StepIndicator current={step} />

        {errors.general && (
          <div className="alert alert-error rounded-xl mb-4 py-2">
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        {/* Step 1 */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label="Full Name" error={errors.name}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <User size={15} className="opacity-40" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="grow text-sm"
                />
              </label>
            </Field>
            <Field label="Email" error={errors.email}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <Mail size={15} className="opacity-40" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="grow text-sm"
                />
              </label>
            </Field>
            <Field label="Password" error={errors.password}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <Lock size={15} className="opacity-40" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="grow text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="opacity-40 hover:opacity-70">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </label>
            </Field>
            <Field
              label="Confirm Password"
              error={errors.password_confirmation}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <Lock size={15} className="opacity-40" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.password_confirmation}
                  onChange={(e) => set('password_confirmation', e.target.value)}
                  className="grow text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="opacity-40 hover:opacity-70">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </label>
            </Field>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label="Company Name" error={errors.company_name}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <Building2 size={15} className="opacity-40" />
                <input
                  type="text"
                  placeholder="e.g. Toko Maju Jaya"
                  value={form.company_name}
                  onChange={(e) => set('company_name', e.target.value)}
                  className="grow text-sm"
                />
              </label>
            </Field>
            <Field label="Business Type" error={errors.company_type}>
              <div className="grid grid-cols-2 gap-2">
                {COMPANY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('company_type', type)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left
                                transition-all duration-150
                                ${
                                  form.company_type === type
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-base-300 hover:border-primary/40'
                                }`}>
                    {type}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm opacity-60 -mt-2 mb-1">
              Set up your first branch. You can add more later.
            </p>
            <Field label="Branch Name" error={errors.branch_name}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <Store size={15} className="opacity-40" />
                <input
                  type="text"
                  placeholder="e.g. Main Store"
                  value={form.branch_name}
                  onChange={(e) => set('branch_name', e.target.value)}
                  className="grow text-sm"
                />
              </label>
            </Field>
            <Field label="City" error={errors.branch_city}>
              <label className="input input-bordered flex items-center gap-2 rounded-xl">
                <MapPin size={15} className="opacity-40" />
                <input
                  type="text"
                  placeholder="e.g. Jakarta"
                  value={form.branch_city}
                  onChange={(e) => set('branch_city', e.target.value)}
                  className="grow text-sm"
                />
              </label>
            </Field>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="btn btn-outline btn-sm flex-1 rounded-xl gap-1">
              <ChevronLeft size={15} /> Back
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary btn-sm flex-1 rounded-xl gap-1">
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary btn-sm flex-1 rounded-xl gap-1">
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Check size={15} />
              )}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          )}
        </div>

        <p className="text-sm text-center mt-4 opacity-60">
          Already have an account?{' '}
          <Link to="/" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
