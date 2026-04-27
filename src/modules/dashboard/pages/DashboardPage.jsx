import Dashboard from '../Dashboard';
import { useDashboardSummary } from '../hooks';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardSummary();

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 p-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-2xl" />
        ))}
      </div>
    );

  return <Dashboard stats={stats} />;
}
