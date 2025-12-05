'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCwIcon, FilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { OrdersCard } from '@/components/admin/orders-card';
import { OrderDetailsDrawer } from '@/components/admin/order-details-drawer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { getAdminOrders } from '@/lib/api';
import { ORDER_STATUS } from '@/constants/order';

import { AdminOrder } from '@/types/api';

const POLLING_INTERVAL = 30000; // 30 seconds

type FilterOption = 'active' | 'served' | 'cancelled' | 'all';

export default function AdminOrdersPage() {
  const t = useTranslations('Admin.orders');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [filter, setFilter] = useState<FilterOption>('active');

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
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
  };

  const handleOrderUpdate = () => {
    fetchOrders(true);
  };

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case 'active':
        return orders.filter(
          (order) =>
            order.status !== ORDER_STATUS.SERVED &&
            order.status !== ORDER_STATUS.CANCELLED,
        );
      case 'served':
        return orders.filter((order) => order.status === ORDER_STATUS.SERVED);
      case 'cancelled':
        return orders.filter(
          (order) => order.status === ORDER_STATUS.CANCELLED,
        );
      case 'all':
        return orders;
      default:
        return orders;
    }
  }, [orders, filter]);

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

  const hasNoOrders = orders.length === 0;
  const hasNoFilteredOrders = filteredOrders.length === 0 && !hasNoOrders;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-4">
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

        <div className="flex items-center gap-2">
          <FilterIcon className="text-muted-foreground h-4 w-4" />
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(value) => {
              if (value) setFilter(value as FilterOption);
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="active" aria-label="Show active orders">
              {t('filters.active')}
            </ToggleGroupItem>
            <ToggleGroupItem value="served" aria-label="Show served orders">
              {t('filters.served')}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="cancelled"
              aria-label="Show cancelled orders"
            >
              {t('filters.cancelled')}
            </ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="Show all orders">
              {t('filters.all')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {hasNoOrders ? (
        <Card className="p-8">
          <div className="text-muted-foreground text-center">
            <p>{t('noOrders')}</p>
          </div>
        </Card>
      ) : hasNoFilteredOrders ? (
        <Card className="p-8">
          <div className="text-muted-foreground text-center">
            <p>{t('noFilteredOrders')}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrdersCard
              key={order._id}
              order={order}
              onOrderClick={handleOrderClick}
              onUpdate={handleOrderUpdate}
            />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          open={true}
          onOpenChange={handleCloseDrawer}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
