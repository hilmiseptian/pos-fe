import { Search } from 'lucide-react';
import { useBranchesForSelector } from '@/modules/branches/hooks';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ReportFilters({
  filters,
  onChange,
  onApply,
  showBranch = false,
  showStatus = false,
  isLoading = false,
}) {
  function set(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div
      className="bg-base-100 border border-base-300 rounded-2xl p-4 mb-6
            flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-base-content/50">From</label>
        <input
          type="date"
          className="input input-sm input-bordered rounded-xl"
          value={filters.date_from}
          onChange={(e) => set('date_from', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-base-content/50">To</label>
        <input
          type="date"
          className="input input-sm input-bordered rounded-xl"
          value={filters.date_to}
          onChange={(e) => set('date_to', e.target.value)}
        />
      </div>

      {showBranch && (
        <BranchFilter
          value={filters.branch_id}
          onChange={(v) => set('branch_id', v)}
        />
      )}

      {showStatus && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-base-content/50">
            Status
          </label>
          <select
            className="select select-sm select-bordered rounded-xl w-36"
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={onApply}
        disabled={isLoading}
        className="btn btn-sm btn-primary rounded-xl gap-2 ml-auto">
        {isLoading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <Search size={14} />
        )}
        Apply
      </button>
    </div>
  );
}

function BranchFilter({ value, onChange }) {
  const { branches, isLoading } = useBranchesForSelector();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-base-content/50">Branch</label>
      <select
        className="select select-sm select-bordered rounded-xl w-40"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}>
        <option value="">All Branches</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
