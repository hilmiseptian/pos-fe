const TABS = [
  { key: 'open', label: 'Open', badge: 'badge-primary' },
  { key: 'paid', label: 'Paid', badge: 'badge-success' },
  { key: 'cancelled', label: 'Cancelled', badge: 'badge-error' },
];

export default function OrderTabs({ active, counts, onChange }) {
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
    </div>
  );
}
