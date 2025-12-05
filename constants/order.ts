import {
  CalendarCheckIcon,
  ClockIcon,
  CookingPotIcon,
  PackageCheckIcon,
  UtensilsIcon,
} from 'lucide-react';

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatusProps = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type OrderStepsProps = {
  key: OrderStatusProps;
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
};

export const ORDER_STEPS_CONFIG: OrderStepsProps[] = [
  { key: ORDER_STATUS.PENDING, Icon: ClockIcon },
  {
    key: ORDER_STATUS.CONFIRMED,
    Icon: CalendarCheckIcon,
  },
  {
    key: ORDER_STATUS.PREPARING,
    Icon: CookingPotIcon,
  },
  { key: ORDER_STATUS.READY, Icon: PackageCheckIcon },
  { key: ORDER_STATUS.SERVED, Icon: UtensilsIcon },
];

// Modern color palette with improved UX: semantic meaning, better contrast, and reduced saturation for professionalism
export const ORDER_STATUS_COLORS: Record<OrderStatusProps, string> = {
  [ORDER_STATUS.PENDING]:
    'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100 border-amber-200 dark:border-amber-800',
  [ORDER_STATUS.CONFIRMED]:
    'bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100 border-sky-200 dark:border-sky-800',
  [ORDER_STATUS.PREPARING]:
    'bg-violet-50 text-violet-900 dark:bg-violet-950 dark:text-violet-100 border-violet-200 dark:border-violet-800',
  [ORDER_STATUS.READY]:
    'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800',
  [ORDER_STATUS.SERVED]:
    'bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 border-neutral-200 dark:border-neutral-800',
  [ORDER_STATUS.CANCELLED]:
    'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-100 border-rose-200 dark:border-rose-800',
};
