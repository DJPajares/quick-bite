'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  ORDER_STEPS_CONFIG,
  type OrderStatusProps,
} from '@/constants/order';
import { ChevronRightIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { updateOrderStatus } from '@/lib/api';
import { toast } from 'sonner';

interface OrderStatusProgressionProps {
  orderId: string;
  currentStatus: OrderStatusProps;
  onUpdate: () => void;
  isUpdating?: boolean;
}

export function OrderStatusProgression({
  orderId,
  currentStatus,
  onUpdate,
  isUpdating = false,
}: OrderStatusProgressionProps) {
  const t = useTranslations();
  const [localUpdating, setLocalUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const isCancelled = currentStatus === ORDER_STATUS.CANCELLED;
  const currentIndex = ORDER_STEPS_CONFIG.findIndex(
    (s) => s.key === currentStatus,
  );
  const canProgress = currentIndex < ORDER_STEPS_CONFIG.length - 1;
  const canCancel = !isCancelled && currentStatus !== ORDER_STATUS.SERVED;
  const updating = isUpdating || localUpdating;

  const getNextStatus = (): OrderStatusProps | null => {
    if (currentIndex < 0 || currentIndex >= ORDER_STEPS_CONFIG.length - 1) {
      return null;
    }
    return ORDER_STEPS_CONFIG[currentIndex + 1].key;
  };

  const handleProgressStatus = async () => {
    const nextStatus = getNextStatus();
    if (!nextStatus) return;

    setLocalUpdating(true);
    try {
      await updateOrderStatus(orderId, { status: nextStatus });
      toast.success(t('Admin.orders.statusUpdated', { status: nextStatus }));
      onUpdate();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error(t('Admin.orders.errorUpdating'));
    } finally {
      setLocalUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    setLocalUpdating(true);
    try {
      await updateOrderStatus(orderId, { status: ORDER_STATUS.CANCELLED });
      toast.success(
        t('Admin.orders.statusUpdated', { status: ORDER_STATUS.CANCELLED }),
      );
      onUpdate();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(t('Admin.orders.errorUpdating'));
    } finally {
      setLocalUpdating(false);
      setShowCancelDialog(false);
    }
  };

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="w-full" disabled>
          {t('Common.orderCancellation.orderCancelled')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        {/* Cancel Button */}
        {canCancel && (
          <Button
            onClick={() => setShowCancelDialog(true)}
            disabled={updating}
            variant="destructive"
            size="icon-lg"
            className="cursor-pointer"
          >
            <XIcon className="size-4" />
          </Button>
        )}
        {/* Progress Button */}
        {canProgress && (
          <Button
            onClick={handleProgressStatus}
            disabled={updating}
            className={`flex-1 cursor-pointer ${ORDER_STATUS_COLORS[getNextStatus()!] || ''}`}
            size="lg"
          >
            {updating ? (
              <>
                <span className="mr-2 inline-block animate-spin">⋯</span>
                {t('Common.updating')}
              </>
            ) : (
              <>
                {t(`Common.order.${getNextStatus()}`)}
                <ChevronRightIcon className="ml-2 size-4" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('Common.orderCancellation.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('Common.orderCancellation.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('Common.ok')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
