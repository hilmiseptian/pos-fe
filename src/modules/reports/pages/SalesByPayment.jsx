import { CreditCard } from 'lucide-react';
import ReportLayout from './components/ReportLayout';
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';
import StatCard from './components/StatCard';
import { useReportFilters } from '../useReportFilters';
import { usePaymentBreakdown } from '../hooks';
import { formatRp } from '@/shared/utils/currency';

const COLUMNS = ['Payment Method', 'Transactions', 'Total Amount', 'Share'];

export default function SalesByPayment() {
  const { filters, committed, set, apply } = useReportFilters();

  const { data, isLoading, isError } = usePaymentBreakdown(committed);

  const rows = data?.rows ?? [];
  const totalAmt = data?.total_amount;
  const totalTrx = data?.total_trx;

  return (
    <ReportLayout
      title="Sales by Payment Method"
      description="Breakdown of transactions by payment method."
      icon={CreditCard}>
      <ReportFilters
        filters={filters}
        onChange={(f) => Object.entries(f).forEach(([k, v]) => set(k, v))}
        onApply={apply}
        showBranch
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
        <StatCard label="Total Amount" value={formatRp(totalAmt)} />
        <StatCard label="Total Transactions" value={totalTrx ?? '—'} />
      </div>

      <ReportTable
        columns={COLUMNS}
        isLoading={isLoading}
        data={
          committed === null
            ? undefined
            : rows.map((row) => {
                const share = totalAmt
                  ? Math.round((row.total_amount / totalAmt) * 100)
                  : 0;
                return (
                  <tr key={row.payment_method}>
                    <td>
                      <span className="badge badge-outline uppercase text-xs">
                        {row.payment_method}
                      </span>
                    </td>
                    <td>{row.total_transactions}</td>
                    <td>{formatRp(row.total_amount)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-base-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-xs text-base-content/50">
                          {share}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
        }
      />
    </ReportLayout>
  );
}
