'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { ClockIcon, UtensilsCrossedIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  OrderStatusProps,
} from '@/constants/order';
import { updateOrderStatus } from '@/lib/api';

import { AdminOrder } from '@/types/api';

interface OrdersTableProps {
  order: AdminOrder;
  onOrderClick: (order: AdminOrder) => void;
  onUpdate: () => void;
}

const statusOrder = Object.values(ORDER_STATUS);

export function OrdersCard({
  order,
  onOrderClick,
  onUpdate,
}: OrdersTableProps) {
  const t = useTranslations();

  // const [newStatus, setNewStatus] = useState<string>(order?.status || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    e: React.MouseEvent,
    orderId: string,
    newStatus: OrderStatusProps,
  ) => {
    e.stopPropagation();

    setIsUpdating(true);

    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success(t('Admin.orders.statusUpdated'));
      onUpdate();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error(t('Admin.orders.errorUpdating'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      className="group flex h-[500px] cursor-pointer flex-col overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg md:h-[600px]"
      onClick={() => onOrderClick(order)}
    >
      <CardHeader className="flex flex-col gap-1 border-b">
        <div className="flex w-full flex-row items-center justify-between">
          <Badge variant="secondary" className="font-semibold">
            {t('Admin.orders.table.tableNumber', {
              number: order.tableNumber,
            })}
          </Badge>
          <Badge
            variant="outline"
            className={`${ORDER_STATUS_COLORS[order.status] || ''} font-semibold`}
          >
            {t(`Admin.orders.status.${order.status}`)}
          </Badge>
        </div>
        <h3 className="text-lg font-bold tracking-tight">
          #{order.orderNumber}
        </h3>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <ClockIcon className="size-3" />
          <span>
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        {/* Order Items */}
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <UtensilsCrossedIcon className="size-4" />
            <span>
              {order.items.length}{' '}
              {order.items.length === 1 ? t('Common.item') : t('Common.items')}
            </span>
          </div>
          <div className="space-y-1 text-sm">
            {/* {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-2">
                    <span className="flex-1 truncate">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-muted-foreground text-xs">
                    +{order.items.length - 3} more item
                    {order.items.length - 3 === 1 ? '' : 's'}
                  </div>
                )} */}
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-2">
                <span className="flex-1 truncate">
                  {item.quantity}x {item.menuItem.name}
                </span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Footer - Total and Status Change */}
      <CardFooter className="flex flex-col gap-2 border-t">
        <div className="flex w-full items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">
            {t('Common.total')}
          </span>
          <span className="text-xl font-bold">${order.total.toFixed(2)}</span>
        </div>

        {order.status !== ORDER_STATUS.CANCELLED && (
          <Select
            value={order.status}
            disabled={isUpdating}
            onValueChange={(value: OrderStatusProps) =>
              handleStatusChange(
                new MouseEvent('click') as unknown as React.MouseEvent,
                order._id,
                value,
              )
            }
          >
            <SelectTrigger
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent onClick={(e) => e.stopPropagation()}>
              {statusOrder.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`Admin.orders.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {order.status === ORDER_STATUS.CANCELLED && (
          <Button variant="outline" className="w-full" disabled>
            {t('Common.orderCancelled')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
