import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { branchLists } from '@/modules/branches/api';
/**
 * Reusable branch multi-select checkbox grid.
 * - Owner: fetches all company branches from API
 * - Admin/Cashier: reads their assigned branches from localStorage user payload
 *
 * Props:
 *   selected   {number[]}  array of selected branch IDs
 *   onChange   {fn}        called with new array of IDs on toggle
 *   token      {string}
 */
export default function BranchSelector({ selected = [], onChange, token }) {
  const [branches, setBranches] = useState([]);
  const [userRaw] = useLocalStorage('user', null);

  useEffect(() => {
    loadBranches();
  }, []);

  async function loadBranches() {
    try {
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (user?.type === 'owner') {
        // Owner — fetch all company branches
        const res = await branchLists(token);
        const list = res.data.data?.data ?? res.data.data ?? [];
        setBranches(list);
      } else {
        // Admin/Cashier — use only their assigned branches from token payload
        setBranches(user?.branches ?? []);
      }
    } catch (err) {
      console.error('Failed to load branches', err);
    }
  }

  function toggleBranch(id) {
    const next = selected.includes(id)
      ? selected.filter((b) => b !== id)
      : [...selected, id];
    onChange(next);
  }

  if (branches.length === 0) {
    return <p className="text-sm opacity-50">No branches available.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {branches.map((branch) => (
        <label
          key={branch.id}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer
                      transition-all duration-150
                      ${
                        selected.includes(branch.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-base-300 hover:border-primary/40'
                      }`}>
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            checked={selected.includes(branch.id)}
            onChange={() => toggleBranch(branch.id)}
          />
          <div>
            <p className="text-sm font-medium">{branch.name}</p>
            <p className="text-xs opacity-50">{branch.city || branch.code}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
