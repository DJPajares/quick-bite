'use client';

import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { AdminOrder } from '@/types/api';
import { ORDER_STATUS } from '@/constants/order';

interface OrdersTableProps {
  orders: AdminOrder[];
  onOrderClick: (order: AdminOrder) => void;
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

export function OrdersTable({ orders, onOrderClick }: OrdersTableProps) {
  const t = useTranslations('Admin.orders');

  if (orders.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-muted-foreground text-center">
          <p>{t('noOrders')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.orderNumber')}</TableHead>
            <TableHead>{t('table.table')}</TableHead>
            <TableHead>{t('table.items')}</TableHead>
            <TableHead>{t('table.total')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead>{t('table.time')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onOrderClick(order)}
            >
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.tableNumber}</TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[order.status] || ''}
                >
                  {t(`status.${order.status}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
