'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { OrderStatusStepper } from '@/components/shared/order-status-stepper';
import { Separator } from '@/components/ui/separator';

import { getBill, getErrorMessage } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import { formatCurrency } from '@/lib/utils';

import type { OrderStatus } from '@/constants/order';

interface BillItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface BillOrder {
  orderNumber: string;
  status: OrderStatus;
  items: BillItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  createdAt: string;
}

interface BillSummary {
  subtotal: number;
  tax: number;
  taxRate: string;
  serviceFee: number;
  serviceFeeRate: string;
  grandTotal: number;
}

interface BillData {
  sessionId: string;
  tableNumber: number;
  orders: {
    count: number;
    items: BillOrder[];
    total: number;
  };
  summary: BillSummary;
}

export default function BillPage() {
  const t = useTranslations();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bill, setBill] = useState<BillData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id || null);
  }, []);

  useEffect(() => {
    const fetchBill = async () => {
      if (!sessionId) return;

      try {
        setIsLoading(true);
        setError(null);

        const sessionId = getSessionId();
        if (!sessionId) {
          setError('No session found');
          return;
        }

        const response = await getBill(sessionId);

        if (response.success) {
          setBill(response.data);
        } else {
          setError('Failed to fetch bill data');
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBill();
  }, [sessionId]);

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );

  if (error)
    return <div className="py-8 text-center text-red-500">{error}</div>;

  if (!bill) return null;

  return (
    <div className="container mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t('Bill.title')}</h1>
        <p className="text-muted-foreground">
          {t('Common.tableNumber', { number: bill.tableNumber })}
        </p>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold">{t('Bill.orderDetails')}</h2>
        <div className="flex flex-col gap-4">
          {bill.orders.items.map((order) => (
            <Card key={order.orderNumber} className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    {t('Bill.orderNumber', { number: order.orderNumber })}
                  </p>
                  <div className="py-4">
                    <OrderStatusStepper status={order.status} />
                  </div>
                </div>

                <div className="text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleString()}
                </div>

                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.name}{' '}
                        <span className="text-muted-foreground text-xs">
                          x{item.quantity}
                        </span>
                      </span>
                      <span>{formatCurrency({ value: item.subtotal })}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span>{t('Common.subTotal')}</span>
                    <span>{formatCurrency({ value: order.subtotal })}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>{t('Common.tax')}</span>
                    <span>{formatCurrency({ value: order.tax })}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>{t('Common.serviceFee')}</span>
                    <span>{formatCurrency({ value: order.serviceFee })}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>{t('Common.total')}</span>
                <span>{formatCurrency({ value: order.total })}</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-4">
        <h2 className="text-lg font-semibold">{t('Common.summary')}</h2>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>{t('Common.subTotal')}</span>
            <span>{formatCurrency({ value: bill.summary.subtotal })}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {t('Common.tax')}{' '}
              <span className="text-muted-foreground text-xs">
                ({bill.summary.taxRate})
              </span>
            </span>
            <span>{formatCurrency({ value: bill.summary.tax })}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {t('Common.serviceFee')}{' '}
              <span className="text-muted-foreground text-xs">
                ({bill.summary.serviceFeeRate})
              </span>
            </span>
            <span>{formatCurrency({ value: bill.summary.serviceFee })}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t('Common.grandTotal')}</span>
          <span>{formatCurrency({ value: bill.summary.grandTotal })}</span>
        </div>
      </Card>
    </div>
  );
}
