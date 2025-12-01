'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCwIcon, AlertCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { InventoryFormDialog } from '@/components/admin/inventory-form-dialog';
import { getInventory } from '@/lib/api';
import { InventoryItem } from '@/types/api';
import { toast } from 'sonner';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations('Admin.inventory');

  const fetchInventory = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        }
        const response = await getInventory();
        setInventory(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
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
    fetchInventory();
  }, [fetchInventory]);

  const handleRefresh = () => {
    fetchInventory(true);
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchInventory(true);
  };

  const isLowStock = (item: InventoryItem) => {
    return item.stockLevel <= item.lowStockThreshold;
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

      {inventory.length === 0 ? (
        <Card className="p-8">
          <div className="text-muted-foreground text-center">
            <p>{t('noItems')}</p>
          </div>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.item')}</TableHead>
                <TableHead>{t('table.stock')}</TableHead>
                <TableHead>{t('table.unit')}</TableHead>
                <TableHead>{t('table.threshold')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.lastRestocked')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <TableCell className="font-medium">
                    {item.menuItemName}
                  </TableCell>
                  <TableCell>{item.stockLevel}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.lowStockThreshold}</TableCell>
                  <TableCell>
                    {isLowStock(item) ? (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      >
                        <AlertCircleIcon className="mr-1 h-3 w-3" />
                        {t('status.low')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {t('status.good')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.lastRestocked
                      ? new Date(item.lastRestocked).toLocaleDateString()
                      : t('table.never')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <InventoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
