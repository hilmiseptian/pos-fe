import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import {
  ArrowLeft,
  Receipt,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { orderDetail } from '@/lib/api/OrderApi';
import { formatRp } from '@/lib/utils/currency';

const STATUS_CONFIG = {
  open: { label: 'Open', class: 'badge-primary', icon: Clock },
  paid: { label: 'Paid', class: 'badge-success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', class: 'badge-error', icon: XCircle },
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token] = useLocalStorage('token', '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrder() {
    try {
      setLoading(true);
      const res = await orderDetail(token, { id });
      setOrder(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-3">
        <p className="text-sm opacity-60">{error ?? 'Order not found.'}</p>
        <button
          onClick={() => navigate('/pos')}
          className="btn btn-sm btn-outline rounded-xl">
          Back to Orders
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.open;
  const StatusIcon = status.icon;
  const payment = order.payment ?? null;
  const details = order.details ?? [];
  const totalQty = details.reduce((sum, d) => sum + d.qty, 0);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top bar */}
      <div className="bg-base-100 border-b border-base-300 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate('/pos')}
          className="btn btn-sm btn-ghost btn-square rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-none">
            {order.sales_number}
          </h1>
          <p className="text-xs opacity-50 mt-0.5">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span className={`badge ${status.class} gap-1`}>
          <StatusIcon size={11} />
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
        {/* ── Order Info ──────────────────────────────────────────────────── */}
        <section className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-base-200">
            <Receipt size={15} className="text-primary" />
            <h2 className="font-semibold text-sm">Order Info</h2>
          </div>
          <div className="px-4 py-3 space-y-2">
            <Row label="Order Number" value={order.sales_number} />
            <Row label="Status">
              <span className={`badge badge-sm ${status.class} gap-1`}>
                <StatusIcon size={10} />
                {status.label}
              </span>
            </Row>
            <Row label="Date" value={formatDate(order.created_at)} />
            {order.notes && <Row label="Notes" value={order.notes} />}
          </div>
        </section>

        {/* ── Item List ───────────────────────────────────────────────────── */}
        <section className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
            <div className="flex items-center gap-2">
              <Package size={15} className="text-primary" />
              <h2 className="font-semibold text-sm">Items</h2>
            </div>
            <span className="text-xs opacity-50">{totalQty} items</span>
          </div>
          <ul className="divide-y divide-base-200">
            {details.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {d.item?.name ?? `Item #${d.item_id}`}
                  </p>
                  <p className="text-xs opacity-50 mt-0.5">
                    {formatRp(d.unit_price)} / pcs
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs opacity-50">x{d.qty}</p>
                  <p className="text-sm font-semibold">
                    {formatRp(d.subtotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Grand Total Summary ─────────────────────────────────────────── */}
        <section className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 space-y-2">
            <Row label="Subtotal" value={formatRp(order.total_amount)} />
            {Number(order.discount_amount) > 0 && (
              <Row
                label="Discount"
                value={`- ${formatRp(order.discount_amount)}`}
                valueClass="text-error"
              />
            )}
            <div className="border-t border-base-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-sm">Grand Total</span>
              <span className="font-bold text-primary">
                {formatRp(order.grand_total)}
              </span>
            </div>
          </div>
        </section>

        {/* ── Payment Info (paid only) ────────────────────────────────────── */}
        {payment && (
          <section className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-base-200">
              <CreditCard size={15} className="text-primary" />
              <h2 className="font-semibold text-sm">Payment</h2>
            </div>
            <div className="px-4 py-3 space-y-2">
              <Row label="Method">
                <span className="badge badge-sm badge-outline uppercase">
                  {payment.payment_method}
                </span>
              </Row>
              <Row label="Amount Paid" value={formatRp(payment.amount_paid)} />
              <Row label="Change" value={formatRp(payment.change_amount)} />
              {payment.paid_at && (
                <Row label="Paid At" value={formatDate(payment.paid_at)} />
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── Reusable row ──────────────────────────────────────────────────────────────

function Row({ label, value, valueClass = '', children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs opacity-50 shrink-0">{label}</span>
      {children ? (
        <div>{children}</div>
      ) : (
        <span className={`text-sm font-medium text-right ${valueClass}`}>
          {value}
        </span>
      )}
    </div>
  );
}
