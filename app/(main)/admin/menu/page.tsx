'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MenuItemCard } from '@/components/shared/menu-item-card';
import { MenuFormDialog } from '@/components/admin/menu-form-dialog';
import { getAdminMenu } from '@/lib/api';
import { MenuItem } from '@/types/api';
import { toast } from 'sonner';

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const t = useTranslations('Admin.menu');

  const fetchMenu = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        }
        const response = await getAdminMenu();
        setMenuItems(response.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
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
    fetchMenu();
  }, [fetchMenu]);

  const handleRefresh = () => {
    fetchMenu(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchMenu(true);
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
    <div className="container mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </Button>
          <Button size="sm" onClick={handleCreate}>
            <PlusIcon className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{t('create')}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            onEdit={() => handleEdit(item)}
            adminMode
          />
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground text-center">
            <p>{t('noItems')}</p>
          </div>
        </div>
      )}

      <MenuFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        item={selectedItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
