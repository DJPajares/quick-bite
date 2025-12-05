'use client';

import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { ClockIcon, UtensilsCrossedIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { ORDER_STATUS_COLORS } from '@/constants/order';

import { AdminOrder } from '@/types/api';
import { OrderStatusProgression } from './order-status-progression';

interface OrdersTableProps {
  order: AdminOrder;
  onOrderClick: (order: AdminOrder) => void;
  onUpdate: () => void;
}

export function OrdersCard({
  order,
  onOrderClick,
  onUpdate,
}: OrdersTableProps) {
  const t = useTranslations();

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

        <div onClick={(e) => e.stopPropagation()}>
          <OrderStatusProgression
            orderId={order._id}
            currentStatus={order.status}
            onUpdate={onUpdate}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
