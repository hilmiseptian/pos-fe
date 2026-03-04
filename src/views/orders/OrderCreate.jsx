import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { ArrowLeft, ShoppingCart, CreditCard, Search } from 'lucide-react';
import { categoryLists } from '../../lib/api/CategoryApi';
import { itemAll } from '../../lib/api/ItemApi';
import {
  orderDetail,
  orderAddItem,
  orderUpdateItem,
  orderRemoveItem,
  orderProcessPayment,
} from '../../lib/api/OrderApi';
import { formatRp } from '../../lib/utils/currency';
import ItemCard from '../components/orders/ItemCard';
import OrderItemRow from '../components/orders/OrderItemRow';
import PaymentModal from '../components/orders/PaymentModal';

export default function OrderCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token] = useLocalStorage('token', '');

  const [order, setOrder] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const debounceRefs = useRef({});

  async function fetchAll() {
    try {
      setLoading(true);
      const [orderRes, categoryRes, itemRes] = await Promise.all([
        orderDetail(token, { id }),
        categoryLists(token),
        itemAll(token),
      ]);
      const fetchedOrder = orderRes.data.data;
      setOrder(fetchedOrder);
      setOrderItems(
        (fetchedOrder.details || []).map((d) => ({
          detailId: d.id,
          id: d.item_id,
          name: d.item?.name ?? '',
          unit_price: d.unit_price,
          qty: d.qty,
        })),
      );
      setCategories(categoryRes.data.data || []);
      setItems(itemRes.data.data || []);
      setFilteredItems(itemRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [id]);

  useEffect(() => {
    let list = items;
    if (activeCategory !== 'all') {
      list = list.filter(
        (i) => String(i.category_id) === String(activeCategory),
      );
    }
    if (search.trim()) {
      list = list.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    setFilteredItems(list);
  }, [activeCategory, search, items]);

  async function handleAddItem(item) {
    const existing = orderItems.find((o) => o.id === item.id);
    if (existing) {
      handleIncrease(existing);
      return;
    }
    const optimisticItem = {
      detailId: null,
      id: item.id,
      name: item.name,
      unit_price: item.selling_price,
      qty: 1,
    };
    setOrderItems((prev) => [...prev, optimisticItem]);
    try {
      const res = await orderAddItem(
        token,
        { id },
        { item_id: item.id, qty: 1 },
      );
      const detail = res.data.data;
      setOrderItems((prev) =>
        prev.map((o) =>
          o.id === item.id && o.detailId === null
            ? { ...o, detailId: detail.id }
            : o,
        ),
      );
    } catch (err) {
      console.error(err);
      setOrderItems((prev) => prev.filter((o) => o.id !== item.id));
      setError('Failed to add item. Please try again.');
    }
  }

  function handleIncrease(item) {
    const newQty = item.qty + 1;
    setOrderItems((prev) =>
      prev.map((o) => (o.id === item.id ? { ...o, qty: newQty } : o)),
    );
    scheduleQtyUpdate(item.detailId, item.id, newQty);
  }

  function handleDecrease(item) {
    if (item.qty <= 1) {
      handleRemove(item);
      return;
    }
    const newQty = item.qty - 1;
    setOrderItems((prev) =>
      prev.map((o) => (o.id === item.id ? { ...o, qty: newQty } : o)),
    );
    scheduleQtyUpdate(item.detailId, item.id, newQty);
  }

  function scheduleQtyUpdate(detailId, itemId, qty) {
    if (!detailId) return;
    if (debounceRefs.current[detailId])
      clearTimeout(debounceRefs.current[detailId]);
    debounceRefs.current[detailId] = setTimeout(async () => {
      try {
        await orderUpdateItem(token, { id, detailId }, { qty });
      } catch (err) {
        console.error(err);
        setError('Failed to update quantity. Please try again.');
      }
      delete debounceRefs.current[detailId];
    }, 500);
  }

  async function handleRemove(item) {
    if (debounceRefs.current[item.detailId]) {
      clearTimeout(debounceRefs.current[item.detailId]);
      delete debounceRefs.current[item.detailId];
    }
    setOrderItems((prev) => prev.filter((o) => o.id !== item.id));
    try {
      await orderRemoveItem(token, { id, detailId: item.detailId });
    } catch (err) {
      console.error(err);
      setOrderItems((prev) => [...prev, item]);
      setError('Failed to remove item. Please try again.');
    }
  }

  async function handleConfirmPayment(paymentData) {
    try {
      setPaymentLoading(true);
      await orderProcessPayment(token, { id }, paymentData);
      setShowPayment(false);
      navigate('/pos');
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  }

  const grandTotal = orderItems.reduce(
    (sum, o) => sum + o.unit_price * o.qty,
    0,
  );
  const totalQty = orderItems.reduce((sum, o) => sum + o.qty, 0);
  const cartIds = new Set(orderItems.map((o) => o.id));

  if (loading) {
    return (
      <div className="h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-base-200 flex flex-col">
      {showPayment && (
        <PaymentModal
          grandTotal={grandTotal}
          onConfirm={handleConfirmPayment}
          onClose={() => setShowPayment(false)}
          loading={paymentLoading}
        />
      )}

      <div className="shrink-0 bg-base-100 border-b border-base-300 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/pos')}
          className="btn btn-sm btn-ghost btn-square rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-bold text-base leading-none">
            {order?.order_number ?? `Order #${id}`}
          </h1>
          <p className="text-xs opacity-50 mt-0.5">Walk-in Customer</p>
        </div>
        {totalQty > 0 && (
          <div className="ml-auto badge badge-primary">{totalQty} items</div>
        )}
      </div>

      {error && (
        <div className="shrink-0 alert alert-error rounded-none px-4 py-2">
          <span className="text-sm">{error}</span>
          <button
            className="btn btn-xs btn-ghost ml-auto"
            onClick={() => setError(null)}>
            x
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-base-300 min-w-0">
          <div className="shrink-0 px-4 pt-4 pb-3 bg-base-100 border-b border-base-300">
            <label className="input input-sm input-bordered flex items-center gap-2 rounded-xl w-full">
              <Search size={14} className="opacity-40" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="grow text-sm"
              />
            </label>
          </div>

          <div className="shrink-0 flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-base-100 border-b border-base-300">
            <button
              onClick={() => setActiveCategory('all')}
              className={`btn btn-xs whitespace-nowrap rounded-lg ${activeCategory === 'all' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}>
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn btn-xs whitespace-nowrap rounded-lg ${String(activeCategory) === String(cat.id) ? 'btn-primary' : 'btn-ghost border border-base-300'}`}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-40">
                <ShoppingCart size={28} className="mb-2" />
                <p className="text-sm">No items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onAdd={handleAddItem}
                    inCart={cartIds.has(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-80 xl:w-96 shrink-0 flex flex-col overflow-hidden bg-base-100">
          <div className="shrink-0 px-4 py-3 border-b border-base-300">
            <h2 className="font-bold text-sm">Order List</h2>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-30 px-4 text-center">
                <ShoppingCart size={28} className="mb-2" />
                <p className="text-sm">
                  No items yet.
                  <br />
                  Tap an item to add.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-base-200">
                {orderItems.map((item) => (
                  <OrderItemRow
                    key={item.id}
                    item={item}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="shrink-0 border-t border-base-300 p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal ({totalQty} items)</span>
                <span>{formatRp(grandTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-base-300">
                <span>Total</span>
                <span className="text-primary">{formatRp(grandTotal)}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => navigate('/pos')}
                className="btn btn-outline btn-sm flex-1 rounded-xl gap-1">
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                disabled={orderItems.length === 0}
                onClick={() => setShowPayment(true)}
                className="btn btn-success btn-sm flex-1 rounded-xl gap-1">
                <CreditCard size={14} />
                Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
