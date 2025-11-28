'use client';

import { useTranslations } from 'next-intl';
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
import { XIcon } from 'lucide-react';
import type { MenuItem } from '@/types/api';
import { Separator } from '@/components/ui/separator';

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

  if (!item) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        {/* Close button */}
        <DrawerClose className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DrawerClose>

        {/* Hero Image */}
        {item.image && (
          <div className="relative -mt-6 h-56 w-full overflow-hidden rounded-t-lg sm:-mt-8 sm:h-64">
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
                  ${item.price.toFixed(2)}
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
          {item.description && (
            <DrawerDescription className="text-left text-base leading-relaxed">
              {item.description}
            </DrawerDescription>
          )}

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
                initialQuantity={cartQuantity}
                disabled={!item.available}
                onAdd={onAdd}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            </div>

            {cartQuantity > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground text-xs tracking-wide uppercase">
                  {t('Menu.subTotal')}
                </span>
                <p className="text-xl font-bold">
                  ${(item.price * cartQuantity).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="mt-4 w-full"
            onClick={() => onOpenChange(false)}
            disabled={!item.available && cartQuantity === 0}
          >
            {cartQuantity > 0 ? t('Menu.updateCart') : t('Menu.closeDetails')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
