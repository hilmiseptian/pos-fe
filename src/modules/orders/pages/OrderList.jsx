import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { orderLists, orderCreate, orderCancel } from '../api';
import OrderCard from '@/shared/components/orders/OrderCard';
import OrderTabs from '@/shared/components/orders/OrderTabs';
import OrderEmptyState from '@/shared/components/orders/OrderEmptyState';
import { useAuth } from '@/modules/auth/context';

const STATUSES = ['open', 'paid', 'cancelled'];

export default function OrderList() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('open');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError(null);
      const res = await orderLists(token);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleCreateOrder() {
    try {
      setCreating(true);
      const res = await orderCreate(token);
      navigate(`/pos/${res.data.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to create order. Please try again.');
      setCreating(false);
    }
  }

  async function handleCancel(id) {
    try {
      await orderCancel(token, { id });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)),
      );
    } catch (err) {
      console.error(err);
      setError('Failed to cancel order. Please try again.');
    }
  }

  // Open  → go to POS editor (/pos/:id)
  // Paid/Cancelled → go to view page (/pos/:id/view)
  function handleCardClick(order) {
    if (order.status === 'open') {
      navigate(`/pos/${order.id}`);
    } else {
      navigate(`/pos/${order.id}/view`);
    }
  }

  const filtered = orders.filter((o) => o.status === activeTab);
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-base-200">
      <div className="px-6 py-6">
        {error && (
          <div className="alert alert-error mb-4 rounded-xl">
            <span className="text-sm">{error}</span>
            <button
              className="btn btn-xs btn-ghost ml-auto"
              onClick={() => setError(null)}>
              x
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <div className="skeleton h-9 w-64 rounded-xl" />
              <div className="skeleton h-8 w-32 rounded-xl" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <OrderTabs
                active={activeTab}
                counts={counts}
                onChange={setActiveTab}
              />
              {activeTab === 'open' && (
                <button
                  onClick={handleCreateOrder}
                  disabled={creating}
                  className="btn btn-primary btn-sm gap-2 rounded-xl">
                  {creating ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {creating ? 'Creating...' : 'Create Order'}
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <OrderEmptyState status={activeTab} />
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => handleCardClick(order)}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
