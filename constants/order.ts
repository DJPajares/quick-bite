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

export const ORDER_STATUS_COLORS: Record<OrderStatusProps, string> = {
  [ORDER_STATUS.PENDING]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
  [ORDER_STATUS.CONFIRMED]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  [ORDER_STATUS.PREPARING]:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
  [ORDER_STATUS.READY]:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
  [ORDER_STATUS.SERVED]:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700',
  [ORDER_STATUS.CANCELLED]:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
};
