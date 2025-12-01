'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { OrdersTable } from '@/components/admin/orders-table';
import { OrderDetailsDrawer } from '@/components/admin/order-details-drawer';
import { getAdminOrders } from '@/lib/api';
import { AdminOrder } from '@/types/api';
import { toast } from 'sonner';

const POLLING_INTERVAL = 30000; // 30 seconds

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations('Admin.orders');

  const fetchOrders = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        }
        const response = await getAdminOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        if (showRefreshIndicator) {
          toast.error(t('errorFetching'));
        }
      } finally {
        setIsLoading(false);
        if (showRefreshIndicator) {
          setIsRefreshing(false);
        }
      }
    },
    [t],
  );

  useEffect(() => {
    fetchOrders();

    // Set up polling
    const interval = setInterval(() => {
      fetchOrders();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const handleOrderClick = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleOrderUpdate = () => {
    fetchOrders(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCwIcon className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-2 text-sm">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCwIcon
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="ml-2 hidden sm:inline">{t('refresh')}</span>
        </Button>
      </div>

      <OrdersTable orders={orders} onOrderClick={handleOrderClick} />

      <OrderDetailsDrawer
        order={selectedOrder}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdate={handleOrderUpdate}
      />
    </div>
  );
}
