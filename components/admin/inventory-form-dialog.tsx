'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InventoryItem } from '@/types/api';
import { updateInventory } from '@/lib/api';
import { toast } from 'sonner';

const inventorySchema = z.object({
  stockLevel: z.number().int().min(0, 'Stock level must be non-negative'),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSuccess: () => void;
}

export function InventoryFormDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: InventoryFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('Admin.inventory.form');

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      stockLevel: 0,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        stockLevel: item.stockLevel,
      });
    }
  }, [item, form]);

  const onSubmit = async (values: InventoryFormValues) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      await updateInventory(item._id, values);
      toast.success(t('updateSuccess'));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(t('updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { item: item.menuItemName })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('currentStock')}</p>
                  <p className="text-lg font-semibold">
                    {item.stockLevel} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('threshold')}</p>
                  <p className="text-lg font-semibold">
                    {item.lowStockThreshold} {item.unit}
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="stockLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('newStock')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {t('stockDescription', { unit: item.unit })}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('updating') : t('update')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
