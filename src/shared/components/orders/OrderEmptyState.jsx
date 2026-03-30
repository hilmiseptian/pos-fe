import { Receipt, CheckCircle, XCircle } from 'lucide-react';

const CONFIG = {
  open: {
    icon: Receipt,
    label: 'No open orders',
    hint: 'Tap "Create Order" to get started',
  },
  paid: {
    icon: CheckCircle,
    label: 'No paid orders yet',
    hint: 'Completed orders will appear here',
  },
  cancelled: {
    icon: XCircle,
    label: 'No cancelled orders',
    hint: 'Cancelled orders will appear here',
  },
};

export default function OrderEmptyState({ status }) {
  const { icon: Icon, label, hint } = CONFIG[status] ?? CONFIG.open;
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-base-100 border border-base-300
                      flex items-center justify-center mb-4">
        <Icon size={28} className="opacity-30" />
      </div>
      <p className="font-semibold opacity-60">{label}</p>
      <p className="text-sm opacity-40 mt-1">{hint}</p>
    </div>
  );
}
