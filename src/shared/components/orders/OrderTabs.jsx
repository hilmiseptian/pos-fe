import { useBranchesForSelector } from '@/modules/branches/hooks';
import { useEffect } from 'react';

const TABS = [
  { key: 'open', label: 'Open', badge: 'badge-primary' },
  { key: 'paid', label: 'Paid', badge: 'badge-success' },
  { key: 'cancelled', label: 'Cancelled', badge: 'badge-error' },
];

export default function OrderTabs({
  active,
  counts,
  onChange,
  selectedBranchId,
  setSelectedBranchId,
}) {
  return (
    <div className="flex gap-1 bg-base-200 p-1 rounded-xl w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
                      transition-all duration-150
                      ${
                        active === tab.key
                          ? 'bg-base-100 shadow-sm text-base-content'
                          : 'text-base-content/50 hover:text-base-content'
                      }`}>
          {tab.label}
          {counts[tab.key] > 0 && (
            <span
              className={`badge badge-xs ${active === tab.key ? tab.badge : 'badge-ghost'}`}>
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
      <BranchFilter
        selectedBranchId={selectedBranchId}
        setSelectedBranchId={setSelectedBranchId}
      />
    </div>
  );
}

// ✅ Fix 1: destructure props with {} instead of two positional params
function BranchFilter({ selectedBranchId, setSelectedBranchId }) {
  const { branches, isLoading } = useBranchesForSelector();

  // ✅ Fix 2: use branches.length as dependency to avoid infinite re-runs
  useEffect(() => {
    if (branches.length === 1) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches.length]);

  // Don't render until branches are ready
  if (isLoading) {
    return <div className="skeleton h-8 w-40 rounded-xl ml-1" />;
  }

  // Only one branch: no need to show the selector
  if (branches.length <= 1) return null;

  return (
    <div className="ml-1">
      <select
        className="select select-sm select-bordered rounded-xl w-40"
        value={selectedBranchId}
        onChange={(e) => setSelectedBranchId(e.target.value)}>
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
