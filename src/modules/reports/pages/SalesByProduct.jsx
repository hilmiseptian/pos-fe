import { Package } from 'lucide-react';
import ReportLayout from './components/ReportLayout';
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';
import StatCard from './components/StatCard';
import { useReportFilters } from '../useReportFilters';
import { useSalesByItem } from '../hooks';
import { formatRp } from '@/shared/utils/currency';

const COLUMNS = ['#', 'Item', 'SKU', 'Qty Sold', 'Revenue'];

export default function SalesByProduct() {
  const { filters, committed, set, apply } = useReportFilters();

  const { data, isLoading, isError } = useSalesByItem(committed);

  const rows = data?.rows ?? [];
  const totalRevenue = data?.total_revenue;
  const totalQty = data?.total_qty;

  return (
    <ReportLayout
      title="Sales by Product"
      description="Top-selling items by quantity and revenue."
      icon={Package}>
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
        <StatCard label="Total Revenue" value={formatRp(totalRevenue)} />
        <StatCard label="Total Qty Sold" value={totalQty ?? '—'} />
      </div>

      <ReportTable
        columns={COLUMNS}
        isLoading={isLoading}
        data={
          committed === null
            ? undefined
            : rows.map((row, i) => (
                <tr key={row.id}>
                  <td className="text-base-content/40 text-sm">{i + 1}</td>
                  <td className="font-medium">{row.name}</td>
                  <td className="text-sm font-mono text-base-content/60">
                    {row.sku}
                  </td>
                  <td>{row.total_qty}</td>
                  <td>{formatRp(row.total_revenue)}</td>
                </tr>
              ))
        }
      />
    </ReportLayout>
  );
}
