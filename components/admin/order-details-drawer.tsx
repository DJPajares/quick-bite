'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { toast } from 'sonner';

import { updateOrderStatus } from '@/lib/api';
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  OrderStatusProps,
} from '@/constants/order';

import { AdminOrder } from '@/types/api';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailsDrawerProps {
  order: AdminOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function OrderDetailsDrawer({
  order,
  open,
  onOpenChange,
  onUpdate,
}: OrderDetailsDrawerProps) {
  const [newStatus, setNewStatus] = useState<OrderStatusProps>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const t = useTranslations('Admin.orders');

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const handleStatusUpdateClick = () => {
    if (!newStatus || newStatus === order.status) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmStatusUpdate = async () => {
    setIsUpdating(true);
    setShowConfirmDialog(false);
    try {
      await updateOrderStatus(order._id, { status: newStatus });
      toast.success(t('statusUpdated', { status: newStatus }));
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
    <>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('details.confirmStatusUpdate')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('details.confirmStatusUpdateDescription', {
                currentStatus: t(`status.${order.status}`),
                newStatus: t(`status.${newStatus}`),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('details.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusUpdate}>
              {t('details.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="flex h-[95vh] flex-col">
          <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col">
            <DrawerHeader className="shrink-0 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col items-start">
                  <DrawerTitle className="text-2xl">
                    {t('details.title')} #{order.orderNumber}
                  </DrawerTitle>
                  <DrawerDescription>
                    {t('details.table')} {order.tableNumber} •{' '}
                    {format(new Date(order.createdAt), 'PPp')}
                  </DrawerDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`${ORDER_STATUS_COLORS[order.status] || ''} px-3 py-1.5 text-sm font-medium`}
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
                            {formatCurrency({ value: item.price })}
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
                      {formatCurrency({ value: order.subtotal })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('details.tax')}
                    </span>
                    <span className="font-medium">
                      {formatCurrency({ value: order.tax })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('details.serviceFee')}
                    </span>
                    <span className="font-medium">
                      {formatCurrency({ value: order.serviceFee })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">{t('details.total')}</span>
                    <span className="font-bold">
                      {formatCurrency({ value: order.total })}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Update Status Section */}
                <div className="flex flex-col gap-3 pb-4">
                  <label className="text-sm font-semibold">
                    {t('details.updateStatus')}
                  </label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) =>
                      setNewStatus(value as OrderStatusProps)
                    }
                  >
                    <SelectTrigger className="h-11">
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
              </div>
            </div>

            <DrawerFooter className="bg-background shrink-0 border-t">
              <div className="flex gap-3">
                <Button
                  onClick={handleStatusUpdateClick}
                  disabled={
                    isUpdating || !newStatus || newStatus === order.status
                  }
                  className="h-11 flex-1"
                >
                  {isUpdating
                    ? t('details.updating')
                    : t('details.updateButton')}
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
    </>
  );
}
