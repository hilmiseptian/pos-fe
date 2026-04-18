import { useBranchesForSelector } from '@/modules/branches/hooks';

export default function BranchSelector({ selected = [], onChange }) {
  const { branches, isLoading } = useBranchesForSelector();

  function toggleBranch(id) {
    const next = selected.includes(id)
      ? selected.filter((b) => b !== id)
      : [...selected, id];
    onChange(next);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    );
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
