/**
 * Renders permissions grouped by module as checkboxes.
 *
 * Props:
 *   grouped        — array of { module, permissions[] } from API
 *   selectedIds    — array of currently selected permission IDs
 *   onChange(ids)  — callback with updated array of selected IDs
 */
export default function PermissionCheckboxGroup({
  grouped,
  selectedIds,
  onChange,
}) {
  const toggle = (id) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    onChange(updated);
  };

  const toggleModule = (permissions) => {
    const ids = permissions.map((p) => p.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) {
      onChange(selectedIds.filter((id) => !ids.includes(id)));
    } else {
      const merged = [...new Set([...selectedIds, ...ids])];
      onChange(merged);
    }
  };

  return (
    <div className="space-y-4">
      {grouped.map(({ module, permissions }) => {
        const ids = permissions.map((p) => p.id);
        const allChecked = ids.every((id) => selectedIds.includes(id));
        const someChecked = ids.some((id) => selectedIds.includes(id));

        return (
          <div key={module} className="border border-base-300 rounded-lg p-4">
            {/* Module header with select-all */}
            <label className="flex items-center gap-2 mb-3 cursor-pointer font-semibold capitalize">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked && !allChecked;
                }}
                onChange={() => toggleModule(permissions)}
              />
              {module}
            </label>

            {/* Individual permissions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-4">
              {permissions.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={selectedIds.includes(perm.id)}
                    onChange={() => toggle(perm.id)}
                  />
                  {perm.name}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
