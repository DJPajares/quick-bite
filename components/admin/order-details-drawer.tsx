'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AdminOrder } from '@/types/api';
import { ORDER_STATUS } from '@/constants/order';
import { updateOrderStatus } from '@/lib/api';
import { toast } from 'sonner';

interface OrderDetailsDrawerProps {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const statusColors: Record<string, string> = {
  [ORDER_STATUS.PENDING]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [ORDER_STATUS.CONFIRMED]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [ORDER_STATUS.PREPARING]:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [ORDER_STATUS.READY]:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [ORDER_STATUS.SERVED]:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  [ORDER_STATUS.CANCELLED]:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function OrderDetailsDrawer({
  order,
  open,
  onOpenChange,
  onUpdate,
}: OrderDetailsDrawerProps) {
  const [newStatus, setNewStatus] = useState<string>(order?.status || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const t = useTranslations('Admin.orders');

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(order._id, { status: newStatus });
      toast.success(t('statusUpdated'));
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error(t('errorUpdating'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex h-[95vh] flex-col">
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col">
          <DrawerHeader className="shrink-0 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DrawerTitle className="text-2xl">
                  {t('details.title')} #{order.orderNumber}
                </DrawerTitle>
                <DrawerDescription className="mt-1.5">
                  {t('details.table')} {order.tableNumber} •{' '}
                  {format(new Date(order.createdAt), 'PPp')}
                </DrawerDescription>
              </div>
              <Badge
                variant="outline"
                className={`${statusColors[order.status] || ''} px-3 py-1.5 text-sm font-medium`}
              >
                {t(`status.${order.status}`)}
              </Badge>
            </div>
          </DrawerHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
            <div className="flex flex-col gap-6">
              {/* Items Section */}
              <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  {t('details.items')}
                  <span className="text-muted-foreground text-sm font-normal">
                    ({order.items.length}{' '}
                    {order.items.length === 1 ? 'item' : 'items'})
                  </span>
                </h3>
                <div className="flex flex-col gap-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-card hover:bg-accent/50 flex items-start justify-between gap-4 rounded-lg border p-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-base leading-tight font-medium">
                          {item.menuItem.name}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                            {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-muted-foreground mb-1 text-sm">
                          × {item.quantity}
                        </p>
                        <p className="text-base font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals Section */}
              <div className="bg-muted/50 flex flex-col gap-3 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('details.subtotal')}
                  </span>
                  <span className="font-medium">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('details.tax')}
                  </span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('details.serviceFee')}
                  </span>
                  <span className="font-medium">
                    ${order.serviceFee.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">{t('details.total')}</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Update Status Section */}
              {order.status !== ORDER_STATUS.SERVED &&
                order.status !== ORDER_STATUS.CANCELLED && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-3 pb-4">
                      <label className="text-sm font-semibold">
                        {t('details.updateStatus')}
                      </label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={t('details.selectStatus')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ORDER_STATUS).map((status) => (
                            <SelectItem key={status} value={status}>
                              {t(`status.${status}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
            </div>
          </div>

          <DrawerFooter className="bg-background shrink-0 border-t">
            <div className="flex gap-3">
              <Button
                onClick={handleStatusUpdate}
                disabled={
                  isUpdating || !newStatus || newStatus === order.status
                }
                className="h-11 flex-1"
              >
                {isUpdating ? t('details.updating') : t('details.updateButton')}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="h-11 flex-1">
                  {t('details.close')}
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
