import { Link } from "react-router-dom";
import { ArrowLeft, BarChart2 } from "lucide-react";

export default function ReportLayout({ title, description, icon: Icon, children }) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-base-content/40 mb-6">
        <Link to="/reports" className="flex items-center gap-1 hover:text-base-content/70 transition-colors">
          <BarChart2 size={12} />
          Reports
        </Link>
        <span>/</span>
        <span className="text-base-content/60">{title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            to="/reports"
            className="btn btn-sm btn-ghost btn-square rounded-xl border border-base-300"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-base-content">{title}</h1>
            {description && (
              <p className="text-sm text-base-content/50 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}