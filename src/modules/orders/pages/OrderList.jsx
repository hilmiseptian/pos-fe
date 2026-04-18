import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useOrdersPaginated, useCreateOrder, useCancelOrder } from '../hooks';
import OrderCard from '@/shared/components/orders/OrderCard';
import OrderTabs from '@/shared/components/orders/OrderTabs';
import OrderEmptyState from '@/shared/components/orders/OrderEmptyState';
import Pagination from '@/shared/components/Pagination';

const STATUSES = ['open', 'paid', 'cancelled'];

export default function OrderList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('open');

  const { data, isLoading } = useOrdersPaginated(page);
  const createMutation = useCreateOrder();
  const cancelMutation = useCancelOrder();

  const allOrders = data?.data ?? [];
  const meta = data?.meta;

  const filtered = allOrders.filter((o) => o.status === activeTab);
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = allOrders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  function handleCardClick(order) {
    if (order.status === 'open') {
      navigate(`/pos/${order.id}`);
    } else {
      navigate(`/pos/${order.id}/view`);
    }
  }

  function handleCreateOrder() {
    createMutation.mutate(
      {},
      {
        onSuccess: (order) => navigate(`/pos/${order.id}`),
      },
    );
  }

  function handleCancel(id) {
    cancelMutation.mutate(id);
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="px-6 py-6">
        {isLoading ? (
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
                  disabled={createMutation.isPending}
                  className="btn btn-primary btn-sm gap-2 rounded-xl">
                  {createMutation.isPending ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {createMutation.isPending ? 'Creating...' : 'Create Order'}
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

            {meta && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
