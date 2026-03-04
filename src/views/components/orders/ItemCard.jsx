import { ShoppingCart } from 'lucide-react';
import { formatRp } from '../../../lib/utils/currency';

export default function ItemCard({ item, onAdd, inCart }) {
  return (
    <div
      onClick={() => onAdd(item)}
      className={`card shadow-sm cursor-pointer active:scale-95 transition-all duration-150 border-2
        ${
          inCart
            ? 'bg-primary text-primary-content border-primary'
            : 'bg-base-100 border-transparent hover:border-primary hover:shadow-md'
        }`}>
      <div className="card-body items-center text-center p-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1
          ${inCart ? 'bg-primary-content/20' : 'bg-primary/10'}`}>
          <ShoppingCart
            size={18}
            className={inCart ? 'text-primary-content' : 'text-primary'}
          />
        </div>
        <h3 className="font-medium text-xs leading-tight line-clamp-2">
          {item.name}
        </h3>
        <p className={`text-xs mt-1 ${inCart ? 'opacity-80' : 'opacity-50'}`}>
          {formatRp(item.selling_price)}
        </p>
        {inCart && (
          <div className="badge badge-sm bg-primary-content/20 text-primary-content border-0 mt-1">
            In cart
          </div>
        )}
      </div>
    </div>
  );
}
