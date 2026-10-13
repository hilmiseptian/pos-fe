import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/modules/auth/context';
import { useOrdersPaginated, useCreateOrder, useCancelOrder } from '../hooks';
import { useSettings, POS_MODES } from '@/modules/settings/context';
import OrderCard from '@/shared/components/orders/OrderCard';
import OrderTabs from '@/shared/components/orders/OrderTabs';
import OrderEmptyState from '@/shared/components/orders/OrderEmptyState';
import Pagination from '@/shared/components/Pagination';
import ShiftGate, {
  ShiftStatusBar,
} from '@/modules/shifts/components/ShiftGate';

const STATUSES = ['open', 'paid', 'cancelled'];

export default function OrderList() {
  const navigate = useNavigate();
  const { posMode } = useSettings();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('open');

  // The first branch id available from auth context (works for both owner & staff)
  const primaryBranchId = user?.branches?.[0]?.id ?? null;

  // selectedBranchId is initialized from primaryBranchId so it's never empty on mount
  const [selectedBranchId, setSelectedBranchId] = useState(
    primaryBranchId ?? '',
  );

  // Sync when primaryBranchId resolves asynchronously (owner: after API query settles)
  useEffect(() => {
    if (!selectedBranchId && primaryBranchId) {
      setSelectedBranchId(primaryBranchId);
    }
  }, [primaryBranchId]);

  const { data, isLoading } = useOrdersPaginated(page);
  const createMutation = useCreateOrder();
  const cancelMutation = useCancelOrder();
  const isQuickService = posMode === POS_MODES.QUICK_SERVICE;

  const allOrders = data?.data ?? [];
  const meta = data?.meta;
  const filtered = allOrders.filter((o) => o.status === activeTab);
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = allOrders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  // Quick Service: skip the list, immediately create an order and jump into it.
  useEffect(() => {
    if (!isQuickService || createMutation.isPending || createMutation.isSuccess)
      return;
    createMutation.mutate(
      {},
      { onSuccess: (order) => navigate(`/pos/${order.id}`, { replace: true }) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuickService]);
  if (isQuickService) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  function handleCardClick(order) {
    navigate(
      order.status === 'open' ? `/pos/${order.id}` : `/pos/${order.id}/view`,
    );
  }

  /** Called by ShiftGate after shift is confirmed open */
  function handleCreateOrder() {
    const resolvedId = Number(selectedBranchId) || null;

    if (!resolvedId) {
      // Guard: branch must be selected before creating an order
      console.warn('No branch selected');
      return;
    }

    createMutation.mutate(
      { branch_id: resolvedId },
      {
        onSuccess: (order) => navigate(`/pos/${order.id}`),
      },
    );
  }

  function handleCancel(id) {
    cancelMutation.mutate(id);
  }

  // Use selectedBranchId (coerced to number) for ShiftGate/ShiftStatusBar
  const activeBranchId = Number(selectedBranchId) || primaryBranchId;

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
            {/* Shift status bar — reflects the currently selected branch */}
            {activeBranchId && (
              <div className="mb-4">
                <ShiftStatusBar branchId={activeBranchId} />
              </div>
            )}

            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <OrderTabs
                active={activeTab}
                counts={counts}
                onChange={setActiveTab}
                selectedBranchId={selectedBranchId}
                setSelectedBranchId={setSelectedBranchId}
              />

              {activeTab === 'open' && activeBranchId && (
                <ShiftGate
                  branchId={activeBranchId}
                  onReady={handleCreateOrder}>
                  <button
                    disabled={createMutation.isPending || !selectedBranchId}
                    className="btn btn-primary btn-sm gap-2 rounded-xl">
                    {createMutation.isPending ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {createMutation.isPending ? 'Creating...' : 'Create Order'}
                  </button>
                </ShiftGate>
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
