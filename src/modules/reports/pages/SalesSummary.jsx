import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import ReportLayout from './components/ReportLayout';
import ReportFilters from './components/ReportFilters';
import StatCard from './components/StatCard';
import { useReportFilters } from '../useReportFilters';
import { useSalesSummary } from '../hooks';
import { formatRp } from '@/shared/utils/currency';

const STATUS_BADGE = {
  open: 'badge-primary',
  paid: 'badge-success',
  cancelled: 'badge-error',
};

const COLUMNS = [
  'Cashier',
  'Sales Number',
  'Date',
  'Status',
  'Subtotal',
  'Discount',
  'Grand Total',
];

export default function SalesSummary() {
  const navigate = useNavigate();
  const { filters, committed, set, apply } = useReportFilters();
  const { data, isLoading, isError } = useSalesSummary(committed);
  const [exporting, setExporting] = useState(false);

  const rows = data?.rows ?? [];
  const totalAmount = data?.total_amount ?? 0;
  const totalDiscount = data?.total_discount ?? 0;
  const totalGrand = data?.total_grand ?? 0;
  const totalTrx = data?.total_trx ?? 0;

  // ── Export ─────────────────────────────────────────────────────────────────
  function handleExport() {
    if (!rows.length) return;
    setExporting(true);

    const sheetData = [
      ['Sales Summary Report'],
      [`Period: ${committed?.date_from} to ${committed?.date_to}`],
      [],
      COLUMNS,
      ...rows.map((r) => [
        r.cashier?.name ?? '-',
        r.sales_number,
        new Date(r.created_at).toLocaleDateString('id-ID'),
        r.status,
        Number(r.total_amount),
        Number(r.discount_amount),
        Number(r.grand_total),
      ]),
      [],
      [
        '',
        '',
        '',
        'TOTAL',
        Number(totalAmount),
        Number(totalDiscount),
        Number(totalGrand),
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Column widths
    ws['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 14 },
      { wch: 12 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Summary');
    XLSX.writeFile(
      wb,
      `sales-summary-${committed?.date_from}-${committed?.date_to}.xlsx`,
    );
    setExporting(false);
  }

  // ── Row click ──────────────────────────────────────────────────────────────
  function handleRowClick(order) {
    if (order.status === 'open') {
      navigate(`/pos/${order.id}`);
    } else {
      navigate(`/pos/${order.id}/view`);
    }
  }

  return (
    <ReportLayout
      title="Sales Summary"
      description="Transaction-level sales data with cashier, status, and amounts."
      icon={TrendingUp}>
      {/* Filters */}
      <ReportFilters
        filters={filters}
        onChange={(f) => Object.entries(f).forEach(([k, v]) => set(k, v))}
        onApply={apply}
        showBranch
        showStatus
        isLoading={isLoading}
      />

      {/* Error */}
      {isError && (
        <div className="alert alert-error rounded-xl mb-4">
          <span className="text-sm">
            Failed to load report. Please try again.
          </span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Transactions"
          value={committed ? totalTrx : '—'}
        />
        <StatCard
          label="Total Subtotal"
          value={committed ? formatRp(totalAmount) : '—'}
        />
        <StatCard
          label="Total Discount"
          value={committed ? formatRp(totalDiscount) : '—'}
        />
        <StatCard
          label="Grand Total"
          value={committed ? formatRp(totalGrand) : '—'}
        />
      </div>

      {/* Table toolbar */}
      {committed && rows.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn btn-sm btn-outline rounded-xl gap-2">
            {exporting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Download size={14} />
            )}
            Export Excel
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm">
            {/* Head */}
            <thead className="bg-base-200 text-base-content/60 text-xs uppercase tracking-wider">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} className="py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {COLUMNS.map((col) => (
                      <td key={col}>
                        <div className="skeleton h-4 w-20 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    className="hover:bg-base-200 cursor-pointer transition-colors duration-150 border-b border-base-200 last:border-0">
                    <td className="font-medium text-sm">
                      {row.cashier?.name ?? '-'}
                    </td>
                    <td className="font-mono text-xs text-base-content/70">
                      {row.sales_number}
                    </td>
                    <td className="text-xs text-base-content/60 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${STATUS_BADGE[row.status] ?? 'badge-ghost'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="text-right tabular-nums text-sm">
                      {formatRp(row.total_amount)}
                    </td>
                    <td className="text-right tabular-nums text-sm text-error">
                      {Number(row.discount_amount) > 0 ? (
                        `- ${formatRp(row.discount_amount)}`
                      ) : (
                        <span className="text-base-content/30">—</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums text-sm font-semibold">
                      {formatRp(row.grand_total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="text-center py-16 text-base-content/30 text-sm">
                    {committed === null
                      ? 'Select a date range and click Apply to load data.'
                      : 'No transactions found for the selected filters.'}
                  </td>
                </tr>
              )}
            </tbody>

            {/* Footer / Summary */}
            {committed && rows.length > 0 && (
              <tfoot className="bg-base-200 font-bold text-sm border-t-2 border-base-300">
                <tr>
                  <td
                    colSpan={4}
                    className="py-3 pl-4 text-base-content/60 uppercase text-xs tracking-wider">
                    Total ({totalTrx} transactions)
                  </td>
                  <td className="text-right tabular-nums pr-4">
                    {formatRp(totalAmount)}
                  </td>
                  <td className="text-right tabular-nums pr-4 text-error">
                    {Number(totalDiscount) > 0 ? (
                      `- ${formatRp(totalDiscount)}`
                    ) : (
                      <span className="text-base-content/30">—</span>
                    )}
                  </td>
                  <td className="text-right tabular-nums pr-4 text-primary">
                    {formatRp(totalGrand)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </ReportLayout>
  );
}
