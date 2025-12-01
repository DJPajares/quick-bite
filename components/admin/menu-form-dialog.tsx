'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MenuItem, CreateMenuItemRequest } from '@/types/api';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/api';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { useState } from 'react';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  available: z.boolean(),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  item: MenuItem | null;
  onSuccess: () => void;
}

export function MenuFormDialog({
  open,
  onOpenChange,
  mode,
  item,
  onSuccess,
}: MenuFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations('Admin.menu.form');

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      available: true,
    },
  });

  useEffect(() => {
    if (item && mode === 'edit') {
      form.reset({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image || '',
        available: item.available ?? true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        available: true,
      });
    }
  }, [item, mode, form]);

  const onSubmit = async (values: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateMenuItemRequest = {
        ...values,
        image: values.image || undefined,
      };

      if (mode === 'create') {
        await createMenuItem(payload);
        toast.success(t('createSuccess'));
      } else if (item) {
        await updateMenuItem(item._id, payload);
        toast.success(t('updateSuccess'));
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error(mode === 'create' ? t('createError') : t('updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      await deleteMenuItem(item._id);
      toast.success(t('deleteSuccess'));
      setShowDeleteDialog(false);
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(t('deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? t('createTitle') : t('editTitle')}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? t('createDescription')
                : t('editDescription')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('namePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('descriptionPlaceholder')}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('price')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('categoryPlaceholder')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('imageUrl')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('imageUrlPlaceholder')}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('imageUrlDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('available')}
                      </FormLabel>
                      <FormDescription>
                        {t('availableDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                {mode === 'edit' && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="sm:mr-auto"
                  >
                    {t('delete')}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t('saving')
                    : mode === 'create'
                      ? t('create')
                      : t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDescription')}
        confirmText={t('deleteConfirm')}
        isDestructive
        isLoading={isDeleting}
      />
    </>
  );
}
