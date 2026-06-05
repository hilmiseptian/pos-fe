import { GitBranch } from 'lucide-react';
import ReportLayout from './components/ReportLayout';
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';
import StatCard from './components/StatCard';
import { useReportFilters } from '../useReportFilters';
import { useSalesByBranch } from '../hooks';
import { formatRp } from '@/shared/utils/currency';

const COLUMNS = ['Branch', 'City', 'Transactions', 'Revenue', 'Avg Order'];

export default function SalesByBranch() {
  const { filters, committed, set, apply } = useReportFilters();

  const { data, isLoading, isError } = useSalesByBranch(committed);

  const rows = data?.rows ?? [];
  const totalRevenue = data?.total_revenue;
  const totalTrx = data?.total_trx;

  return (
    <ReportLayout
      title="Sales by Branch"
      description="Compare revenue and transaction volume across all branches."
      icon={GitBranch}>
      <ReportFilters
        filters={filters}
        onChange={(f) => Object.entries(f).forEach(([k, v]) => set(k, v))}
        onApply={apply}
        isLoading={isLoading}
      />

      {isError && (
        <div className="alert alert-error rounded-xl mb-4">
          <span className="text-sm">
            Failed to load report. Please try again.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatRp(totalRevenue)} />
        <StatCard label="Total Transactions" value={totalTrx ?? '—'} />
      </div>

      <ReportTable
        columns={COLUMNS}
        isLoading={isLoading}
        data={
          committed === null
            ? undefined
            : rows.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium">{row.name}</td>
                  <td className="text-sm text-base-content/60">
                    {row.city ?? '—'}
                  </td>
                  <td>{row.total_transactions}</td>
                  <td>{formatRp(row.total_revenue)}</td>
                  <td>{formatRp(row.avg_order_value)}</td>
                </tr>
              ))
        }
      />
    </ReportLayout>
  );
}
