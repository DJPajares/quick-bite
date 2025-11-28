'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { QuantityControl } from '@/components/shared/quantity-control';
import type { MenuItem } from '@/types/api';

interface MenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAdd: (menuItemId: string, quantity: number) => Promise<void>;
  onUpdate: (menuItemId: string, quantity: number) => Promise<void>;
  onRemove: (menuItemId: string) => Promise<void>;
  onClick?: () => void;
}

export function MenuItemCard({
  item,
  cartQuantity,
  onAdd,
  onUpdate,
  onRemove,
  onClick,
}: MenuItemCardProps) {
  const t = useTranslations();

  return (
    <Card
      className="flex h-36 cursor-pointer flex-row gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md md:h-48"
      onClick={onClick}
    >
      {/* Image Section - Square covering full height */}
      <div className="bg-muted relative aspect-square h-full shrink-0">
        {item.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
            {t('Common.noImage')}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h3 className="line-clamp-1 text-base leading-tight font-semibold">
            {item.name}
          </h3>

          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-bold">${item.price.toFixed(2)}</p>

            <div
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <QuantityControl
                menuItemId={item._id}
                initialQuantity={cartQuantity}
                disabled={!item.available}
                onAdd={onAdd}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
