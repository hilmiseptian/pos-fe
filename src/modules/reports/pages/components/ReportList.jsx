import { Link } from 'react-router-dom';
import { BarChart2, TrendingUp, ChevronRight } from 'lucide-react';

const REPORTS = [
  {
    title: 'Sales Summary',
    description:
      'Transaction-level sales data with cashier, status, amounts, and order detail.',
    icon: TrendingUp,
    route: '/reports/sales-summary',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    ready: true,
  },
  // others hidden until ready
];

export default function ReportList() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center">
          <BarChart2 size={18} className="text-base-content/60" />
        </div>
        <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
          Reports
        </span>
      </div>
      <h1 className="text-2xl font-bold text-base-content mb-1">
        Available Reports
      </h1>
      <p className="text-base-content/50 text-sm mb-8">
        Select a report to view insights about your sales data.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.filter((r) => r.ready).map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.route}
              to={report.route}
              className={`group flex items-start gap-4 bg-base-100 border
                                ${report.border} rounded-2xl p-5 hover:shadow-md
                                hover:-translate-y-0.5 transition-all duration-200`}>
              <div
                className={`w-11 h-11 rounded-xl ${report.bg} flex items-center
                                justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={20} className={report.color} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base-content text-sm">
                  {report.title}
                </p>
                <p className="text-xs text-base-content/50 mt-1 leading-relaxed">
                  {report.description}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-base-content/30 shrink-0 mt-0.5
                                group-hover:text-base-content/60 transition-all duration-200"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
