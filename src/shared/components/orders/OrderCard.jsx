import { useState } from 'react';
import { Clock, ArrowRight, Receipt, X, AlertTriangle } from 'lucide-react';

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
}

function formatRp(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

const STATUS_BADGE = {
  open: 'badge-primary',
  paid: 'badge-success',
  cancelled: 'badge-error',
};

// ── Cancel popover ────────────────────────────────────────────────────────────

function CancelPopover({ onConfirm, onDismiss, loading }) {
  return (
    <div
      className="absolute right-0 top-full mt-2 z-20 w-56 bg-base-100 border border-base-300
                    rounded-xl shadow-lg p-3 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <AlertTriangle size={15} className="text-warning shrink-0 mt-0.5" />
        <p className="text-xs leading-snug">
          Cancel this order? This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onDismiss}
          disabled={loading}
          className="btn btn-xs btn-ghost flex-1 rounded-lg">
          Keep
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn btn-xs btn-error flex-1 rounded-lg">
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            'Cancel Order'
          )}
        </button>
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────

export default function OrderCard({ order, onClick, onCancel }) {
  const [showPopover, setShowPopover] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isOpen = order.status === 'open';

  async function handleConfirmCancel(e) {
    e.stopPropagation();
    setCancelling(true);
    await onCancel(order.id);
    setCancelling(false);
    setShowPopover(false);
  }

  function handleCancelClick(e) {
    e.stopPropagation();
    setShowPopover((prev) => !prev);
  }

  function handleDismiss(e) {
    e?.stopPropagation();
    setShowPopover(false);
  }

  function handleCardClick() {
    onClick(order.id);
  }

  return (
    <div className="relative">
      {/* ── Card (div, not button, to allow button children) ────────────── */}
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        className={`w-full text-left group bg-base-100 border border-base-300 rounded-2xl p-4
                    flex items-center justify-between gap-4
                    transition-all duration-200 shadow-sm cursor-pointer
                    ${
                      isOpen
                        ? 'hover:bg-primary hover:text-primary-content hover:border-primary hover:shadow-md active:scale-[0.98]'
                        : 'hover:bg-base-200 hover:shadow-md active:scale-[0.98]'
                    }`}>
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${isOpen ? 'bg-primary/10 group-hover:bg-primary-content/20' : 'bg-base-200 group-hover:bg-base-300'}`}>
          <Receipt
            size={20}
            className={
              isOpen
                ? 'text-primary group-hover:text-primary-content transition-colors'
                : 'opacity-40'
            }
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm tracking-wide">
              {order.sales_number}
            </p>
            <span
              className={`badge badge-xs ${STATUS_BADGE[order.status] ?? 'badge-ghost'}`}>
              {order.status}
            </span>
            {order.payment?.payment_method && (
              <span className="badge badge-xs badge-outline uppercase">
                {order.payment.payment_method}
              </span>
            )}
          </div>
          <p className="text-xs opacity-60 mt-0.5 flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(order.created_at)}
          </p>
        </div>

        {/* Right meta */}
        <div className="text-right shrink-0">
          <p className="text-xs opacity-60">
            {order.details_count ?? order.details?.length ?? 0} items
          </p>
          <p className="font-semibold text-sm mt-0.5">
            {formatRp(order.grand_total)}
          </p>
        </div>

        {/* Cancel button (open) or arrow (paid/cancelled) */}
        {isOpen ? (
          <button
            onClick={handleCancelClick}
            className={`btn btn-xs btn-ghost btn-square rounded-lg border shrink-0 transition-colors
                        ${
                          showPopover
                            ? 'border-error text-error bg-error/10'
                            : 'border-base-300 opacity-50 group-hover:opacity-100 group-hover:border-base-100/40 group-hover:text-primary-content'
                        }`}>
            <X size={14} />
          </button>
        ) : (
          <ArrowRight
            size={16}
            className="opacity-30 shrink-0 group-hover:opacity-70 transition-opacity"
          />
        )}
      </div>

      {/* Cancel popover */}
      {showPopover && (
        <>
          <div className="fixed inset-0 z-10" onClick={handleDismiss} />
          <CancelPopover
            onConfirm={handleConfirmCancel}
            onDismiss={handleDismiss}
            loading={cancelling}
          />
        </>
      )}
    </div>
  );
}
