// src/modules/shifts/components/ShiftGate.jsx
import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useActiveShift, useOpenShift, useCloseShift } from '../hooks';

function formatTime(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  });
}

/** Modal: ask user to open a new shift */
function OpenShiftModal({ onConfirm, onDismiss, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
            <Clock size={20} className="text-warning" />
          </div>
          <div>
            <h2 className="font-bold text-base">No Active Shift</h2>
            <p className="text-xs opacity-60">Open a shift to start taking orders.</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onDismiss}
            disabled={loading}
            className="btn btn-outline btn-sm flex-1 rounded-xl">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-warning btn-sm flex-1 rounded-xl gap-1">
            {loading
              ? <span className="loading loading-spinner loading-xs" />
              : <CheckCircle size={15} />}
            {loading ? 'Opening...' : 'Open Shift'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Compact shift status bar shown in OrderList header */
export function ShiftStatusBar({ branchId }) {
  const { data: shift, isLoading } = useActiveShift(branchId);
  const closeShift = useCloseShift(branchId);
  const [confirmClose, setConfirmClose] = useState(false);

  if (isLoading) return <div className="skeleton h-8 w-64 rounded-xl" />;

  if (!shift) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warning/10 border border-warning/30 text-warning text-xs font-medium">
        <AlertTriangle size={13} />
        No active shift
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-medium">
        <Clock size={13} />
        Shift open since {formatTime(shift.open_time)}
        <span className="opacity-60">· {shift.batch}</span>
      </div>
      {!confirmClose ? (
        <button
          onClick={() => setConfirmClose(true)}
          className="btn btn-xs btn-error btn-outline rounded-xl gap-1">
          <X size={12} /> Close Shift
        </button>
      ) : (
        <div className="flex gap-1">
          <button
            onClick={() => setConfirmClose(false)}
            className="btn btn-xs btn-ghost rounded-xl">
            Keep
          </button>
          <button
            onClick={() =>
              closeShift.mutate(shift.id, {
                onSuccess: () => setConfirmClose(false),
              })
            }
            disabled={closeShift.isPending}
            className="btn btn-xs btn-error rounded-xl">
            {closeShift.isPending
              ? <span className="loading loading-spinner loading-xs" />
              : 'Confirm Close'}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Wrap around "Create Order" button.
 * If no active shift → show OpenShiftModal first.
 */
export default function ShiftGate({ branchId, onReady, children }) {
  const { data: shift, isLoading } = useActiveShift(branchId);
  const openShift = useOpenShift(branchId);
  const [showModal, setShowModal] = useState(false);

  function handleClick() {
    if (shift) {
      onReady(shift);
    } else {
      setShowModal(true);
    }
  }

  function handleConfirmOpen() {
    openShift.mutate(undefined, {
      onSuccess: (newShift) => {
        setShowModal(false);
        onReady(newShift);
      },
    });
  }

  if (isLoading) return null;

  return (
    <>
      {showModal && (
        <OpenShiftModal
          onConfirm={handleConfirmOpen}
          onDismiss={() => setShowModal(false)}
          loading={openShift.isPending}
        />
      )}
      <span onClick={handleClick}>{children}</span>
    </>
  );
}