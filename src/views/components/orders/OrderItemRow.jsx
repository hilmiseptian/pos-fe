import { Plus, Minus, X } from 'lucide-react';
import { formatRp } from '../../../lib/utils/currency';

export default function OrderItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 group">
      {/* Name & unit price */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight truncate">
          {item.name}
        </p>
        <p className="text-xs opacity-50 mt-0.5">
          {formatRp(item.unit_price)} / pcs
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onDecrease(item)}
          className="btn btn-xs btn-ghost btn-square rounded-lg border border-base-300 hover:border-error hover:text-error">
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
        <button
          onClick={() => onIncrease(item)}
          className="btn btn-xs btn-ghost btn-square rounded-lg border border-base-300 hover:border-primary hover:text-primary">
          <Plus size={12} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right shrink-0 w-20">
        <p className="text-sm font-semibold">
          {formatRp(item.unit_price * item.qty)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item)}
        className="btn btn-xs btn-ghost btn-square text-error opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </li>
  );
}
