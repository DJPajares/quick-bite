'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  RefreshCwIcon,
  ShoppingBagIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardAnalytics } from '@/lib/api';
import { DashboardAnalytics } from '@/types/api';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

const POLLING_INTERVAL = 60000; // 60 seconds

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = useTranslations('Admin.dashboard');

  const fetchAnalytics = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        }
        const response = await getDashboardAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        if (showRefreshIndicator) {
          toast.error(t('errorFetching'));
        }
      } finally {
        setIsLoading(false);
        if (showRefreshIndicator) {
          setIsRefreshing(false);
        }
      }
    },
    [t],
  );

  useEffect(() => {
    fetchAnalytics();

    // Set up polling
    const interval = setInterval(() => {
      fetchAnalytics();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCwIcon className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-2 text-sm">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCwIcon
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="ml-2 hidden sm:inline">{t('refresh')}</span>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('metrics.totalRevenue')}
            </CardTitle>
            <DollarSignIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency({ value: analytics.totalRevenue })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('metrics.totalOrders')}
            </CardTitle>
            <ShoppingBagIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('metrics.averageOrder')}
            </CardTitle>
            <TrendingUpIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency({ value: analytics.averageOrderValue })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('metrics.ordersToday')}
            </CardTitle>
            <ClockIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.ordersToday}</div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency({ value: analytics.revenueToday })}{' '}
              {t('metrics.revenue')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t('popularItems.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.popularItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {t('popularItems.noData')}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {analytics.popularItems.map((item, index) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.orderCount} {t('popularItems.orders')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency({ value: item.revenue })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentOrders.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {t('recentOrders.noData')}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {analytics.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-muted-foreground text-sm">
                      {t('recentOrders.table')} {order.tableNumber} •{' '}
                      {order.items.length} {t('recentOrders.items')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency({ value: order.total })}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
