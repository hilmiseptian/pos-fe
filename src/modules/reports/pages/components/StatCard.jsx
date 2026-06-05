export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl p-5">
      <p className="text-xs text-base-content/50 mb-1">{label}</p>
      <p className="text-2xl font-bold text-base-content">{value ?? "—"}</p>
      {sub && <p className="text-xs text-base-content/40 mt-1">{sub}</p>}
    </div>
  );
}