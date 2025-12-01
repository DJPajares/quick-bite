'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { XIcon } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuantityControl } from '@/components/shared/quantity-control';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';

import { formatCurrency } from '@/lib/utils';

import type { MenuItem } from '@/types/api';

interface MenuItemDrawerProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartQuantity: number;
  onAdd: (menuItemId: string, quantity: number) => Promise<void>;
  onUpdate: (menuItemId: string, quantity: number) => Promise<void>;
  onRemove: (menuItemId: string) => Promise<void>;
}

export function MenuItemDrawer({
  item,
  open,
  onOpenChange,
  cartQuantity,
  onAdd,
  onUpdate,
  onRemove,
}: MenuItemDrawerProps) {
  const t = useTranslations();
  const [localQuantity, setLocalQuantity] = useState(cartQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Sync local quantity with cart quantity when drawer opens
  useEffect(() => {
    if (open) {
      setLocalQuantity(cartQuantity);
    }
  }, [open, cartQuantity]);

  if (!item) return null;

  const handleLocalAdd = async () => {
    setLocalQuantity((prev) => prev + 1);
  };

  const handleLocalUpdate = async (_menuItemId: string, quantity: number) => {
    setLocalQuantity(quantity);
  };

  const handleLocalRemove = async () => {
    setLocalQuantity(0);
  };

  const handleButtonClick = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirm = async () => {
    if (!item) return;

    setIsUpdating(true);
    try {
      if (localQuantity === 0 && cartQuantity > 0) {
        // Remove from cart
        await onRemove(item._id);
      } else if (cartQuantity === 0 && localQuantity > 0) {
        // Add to cart
        await onAdd(item._id, localQuantity);
      } else if (localQuantity !== cartQuantity) {
        // Update quantity
        await onUpdate(item._id, localQuantity);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = localQuantity !== cartQuantity;

  const getConfirmationTitle = () => {
    if (localQuantity === 0) return t('Menu.confirmRemove');
    if (cartQuantity === 0) return t('Menu.confirmAdd');
    return t('Menu.confirmUpdate');
  };

  const getConfirmationDescription = () => {
    if (localQuantity === 0) {
      return t('Menu.confirmRemoveDescription', { itemName: item.name });
    }
    if (cartQuantity === 0) {
      return t('Menu.confirmAddDescription', {
        itemName: item.name,
        quantity: localQuantity,
      });
    }
    return t('Menu.confirmUpdateDescription', {
      itemName: item.name,
      oldQuantity: cartQuantity,
      newQuantity: localQuantity,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-h-[90vh] max-w-lg">
        {/* Close button */}
        <DrawerClose className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DrawerClose>

        {/* Hero Image */}
        {item.image && (
          <div className="relative -mt-7 h-56 w-full overflow-hidden rounded-t-lg sm:-mt-8 sm:h-64">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            {/* Availability badge overlay */}
            <div className="absolute bottom-4 left-4">
              {item.available ? (
                <Badge className="bg-green-600 text-white hover:bg-green-700">
                  {t('Menu.available')}
                </Badge>
              ) : (
                <Badge variant="destructive">{t('Menu.unavailable')}</Badge>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4 overflow-y-auto p-4">
          <DrawerHeader className="px-0">
            {/* Item name and price */}
            <div className="flex items-start justify-between gap-4">
              <DrawerTitle className="text-left text-2xl leading-tight">
                {item.name}
              </DrawerTitle>

              <div className="shrink-0 text-right">
                <p className="text-primary text-2xl font-bold">
                  {formatCurrency({ value: item.price })}
                </p>
              </div>
            </div>

            {/* Category */}
            {item.category && (
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {t(`Menu.categories.${item.category}`)}
                </Badge>
              </div>
            )}
          </DrawerHeader>

          {/* Description */}
          <DrawerDescription className="text-left text-base leading-relaxed">
            {item.description || t('Menu.noDescription')}
          </DrawerDescription>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                {t('Menu.tags')}
              </h3>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer with quantity control */}
        <DrawerFooter>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                {t('Menu.quantity')}
              </span>

              <QuantityControl
                menuItemId={item._id}
                initialQuantity={localQuantity}
                disabled={!item.available || isUpdating}
                onAdd={handleLocalAdd}
                onUpdate={handleLocalUpdate}
                onRemove={handleLocalRemove}
              />
            </div>

            {localQuantity > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground text-xs tracking-wide uppercase">
                  {t('Menu.subTotal')}
                </span>
                <p className="text-xl font-bold">
                  {formatCurrency({ value: item.price * localQuantity })}
                </p>
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="mt-4 w-full"
            onClick={handleButtonClick}
            disabled={(!item.available && localQuantity === 0) || isUpdating}
          >
            {isUpdating
              ? t('Menu.updating')
              : hasChanges
                ? localQuantity > 0
                  ? t('Menu.updateCart')
                  : t('Menu.removeFromCart')
                : t('Menu.close')}
          </Button>
        </DrawerFooter>
      </DrawerContent>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={getConfirmationTitle()}
        description={getConfirmationDescription()}
        cancelText={t('Menu.cancel')}
        confirmText={t('Menu.confirm')}
        onConfirm={handleConfirm}
        variant={localQuantity === 0 ? 'destructive' : 'default'}
      />
    </Drawer>
  );
}
