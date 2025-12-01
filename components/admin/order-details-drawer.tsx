'use client';

import { useState } from 'react';
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
  const [newStatus, setNewStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const t = useTranslations('Admin.orders');

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
      toast.error(t('errorUpdating'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>
              {t('details.title')} #{order.orderNumber}
            </DrawerTitle>
            <DrawerDescription>
              {t('details.table')} {order.tableNumber} •{' '}
              {format(new Date(order.createdAt), 'PPp')}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4">
            {/* Current Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('details.status')}</span>
              <Badge
                variant="outline"
                className={statusColors[order.status] || ''}
              >
                {t(`status.${order.status}`)}
              </Badge>
            </div>

            <Separator />

            {/* Items */}
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">{t('details.items')}</h3>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItem.name}</p>
                    {item.specialInstructions && (
                      <p className="text-muted-foreground text-sm">
                        {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm">
                      x{item.quantity}
                    </p>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>{t('details.subtotal')}</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('details.tax')}</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('details.serviceFee')}</span>
                <span>${order.serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>{t('details.total')}</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Update Status */}
            {order.status !== ORDER_STATUS.SERVED &&
              order.status !== ORDER_STATUS.CANCELLED && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      {t('details.updateStatus')}
                    </label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('details.selectStatus')} />
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

          <DrawerFooter>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating || !newStatus || newStatus === order.status}
            >
              {isUpdating ? t('details.updating') : t('details.updateButton')}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">{t('details.close')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
