import { useState } from 'react';
import { X, Banknote, QrCode, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatRp, parseAmount } from '../../../lib/utils/currency';

const MONEY_UNITS = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

export default function PaymentModal({
  grandTotal,
  onConfirm,
  onClose,
  loading,
}) {
  const [method, setMethod] = useState('cash');
  const [amountInput, setAmountInput] = useState('');

  const amountPaid = parseAmount(amountInput);
  const change = amountPaid - grandTotal;
  const isUnder = amountPaid > 0 && amountPaid < grandTotal;
  const isExact = amountPaid === grandTotal;
  const canConfirm = amountPaid > 0;

  function handleQuickSelect(unit) {
    setAmountInput((prev) => {
      const current = parseAmount(prev);
      return (current + unit).toString();
    });
  }

  function handleAmountChange(e) {
    setAmountInput(e.target.value.replace(/\D/g, ''));
  }

  function handleConfirm() {
    onConfirm({
      payment_method: method,
      amount_paid: amountPaid,
      change_amount: Math.max(0, change),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h2 className="font-bold text-lg">Payment</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-square rounded-xl">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Grand total */}
          <div className="bg-base-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm opacity-60">Grand Total</span>
            <span className="text-xl font-bold text-primary">
              {formatRp(grandTotal)}
            </span>
          </div>

          {/* Method selection */}
          <div>
            <p className="text-xs font-semibold opacity-50 uppercase tracking-wider mb-2">
              Payment Method
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMethod('cash')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  method === 'cash'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-base-300 hover:border-primary/40'
                }`}>
                <Banknote size={24} />
                <span className="text-sm font-semibold">Cash</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-base-300 opacity-40 cursor-not-allowed">
                <QrCode size={24} />
                <span className="text-sm font-semibold">QRIS</span>
                <span className="badge badge-xs">Soon</span>
              </button>
            </div>
          </div>

          {/* Cash section */}
          {method === 'cash' && (
            <div className="space-y-3">
              {/* Quick select */}
              <div>
                <p className="text-xs font-semibold opacity-50 uppercase tracking-wider mb-2">
                  Quick Select
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {MONEY_UNITS.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handleQuickSelect(unit)}
                      className="btn btn-sm btn-outline rounded-xl text-xs font-semibold hover:btn-primary">
                      {unit >= 1000 ? `${unit / 1000}K` : unit}
                    </button>
                  ))}
                  <button
                    onClick={() => setAmountInput('')}
                    className="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs text-error hover:bg-error/10">
                    Clear
                  </button>
                </div>
              </div>

              {/* Free text input */}
              <div>
                <p className="text-xs font-semibold opacity-50 uppercase tracking-wider mb-2">
                  Amount Received
                </p>
                <label className="input input-bordered flex items-center gap-2 rounded-xl w-full">
                  <span className="text-sm opacity-50 shrink-0">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={
                      amountInput
                        ? Number(amountInput).toLocaleString('id-ID')
                        : ''
                    }
                    onChange={handleAmountChange}
                    className="grow text-sm font-semibold"
                  />
                </label>
              </div>

              {/* Summary */}
              {amountPaid > 0 && (
                <div className="bg-base-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Grand Total</span>
                    <span className="font-medium">{formatRp(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Amount Paid</span>
                    <span className="font-medium">{formatRp(amountPaid)}</span>
                  </div>
                  <div className="border-t border-base-300 pt-2 flex justify-between font-bold">
                    <span>{change >= 0 ? 'Change' : 'Remaining'}</span>
                    <span
                      className={change >= 0 ? 'text-success' : 'text-error'}>
                      {formatRp(Math.abs(change))}
                    </span>
                  </div>
                </div>
              )}

              {isUnder && (
                <div className="alert alert-warning rounded-xl py-2">
                  <AlertTriangle size={16} />
                  <span className="text-xs">
                    Amount is less than total by{' '}
                    {formatRp(grandTotal - amountPaid)}
                  </span>
                </div>
              )}

              {isExact && (
                <div className="alert alert-success rounded-xl py-2">
                  <CheckCircle size={16} />
                  <span className="text-xs">
                    Exact amount — no change needed
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-300 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn btn-outline btn-sm flex-1 rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            className="btn btn-success btn-sm flex-1 rounded-xl gap-2">
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <CheckCircle size={16} />
            )}
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
