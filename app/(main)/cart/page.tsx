'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Trash2Icon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MenuItemDrawer } from '@/components/shared/menu-item-drawer';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';

import {
  getCart,
  getErrorMessage,
  submitOrder,
  removeFromCart,
  addToCart,
  updateCart,
} from '@/lib/api';
import { getSessionId } from '@/lib/session';

import type { CartData, CartItemDetail, MenuItem } from '@/types/api';

export default function CartPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItemDetail | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls from React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sessionId = getSessionId();
        if (!sessionId) {
          setError('No session found');
          return;
        }

        const response = await getCart(sessionId);

        if (response.success) {
          setCartData(response.data);
        } else {
          setError('Failed to fetch cart data');
        }
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Error fetching cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleSubmitOrderClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmitOrder = async () => {
    if (!cartData) return;
    const sessionId = cartData.sessionId || getSessionId();
    if (!sessionId) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const result = await submitOrder({ sessionId, notes: '' });
      if (result.success) {
        setSubmitSuccess(result.message || 'Order submitted successfully');
        // Clear cart locally to reflect submission
        setCartData((prev) =>
          prev
            ? {
                ...prev,
                cart: [],
                cartTotal: 0,
              }
            : prev,
        );
      } else {
        setSubmitError(result.message || 'Failed to submit order');
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item: CartItemDetail) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !cartData) return;
    const menuItemId = itemToDelete.menuItem._id;
    const sessionId = cartData.sessionId || getSessionId();
    if (!sessionId) return;

    setRemovingIds((prev) => new Set(prev).add(menuItemId));
    try {
      await removeFromCart({ sessionId, menuItemId });
      setCartData((prev) =>
        prev
          ? {
              ...prev,
              cart: prev.cart.filter((c) => c.menuItem._id !== menuItemId),
              cartTotal: prev.cart
                .filter((c) => c.menuItem._id !== menuItemId)
                .reduce((sum, c) => sum + c.price * c.quantity, 0),
            }
          : prev,
      );
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(menuItemId);
        return next;
      });
      setItemToDelete(null);
    }
  };

  const handleRemoveItem = async (menuItemId: string) => {
    if (!cartData) return;
    const sessionId = cartData.sessionId || getSessionId();
    if (!sessionId) return;
    setRemovingIds((prev) => new Set(prev).add(menuItemId));
    try {
      await removeFromCart({ sessionId, menuItemId });
      setCartData((prev) =>
        prev
          ? {
              ...prev,
              cart: prev.cart.filter((c) => c.menuItem._id !== menuItemId),
              cartTotal: prev.cart
                .filter((c) => c.menuItem._id !== menuItemId)
                .reduce((sum, c) => sum + c.price * c.quantity, 0),
            }
          : prev,
      );
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(menuItemId);
        return next;
      });
    }
  };

  const handleItemClick = (cartItem: CartItemDetail) => {
    // Convert CartItemDetail's menuItem to MenuItem format
    const menuItem: MenuItem = {
      _id: cartItem.menuItem._id,
      name: cartItem.menuItem.name,
      description: '', // Not available in cart data
      price: cartItem.menuItem.price,
      category: cartItem.menuItem.category,
      image: cartItem.menuItem.image,
      available: true, // Assume available if in cart
      tags: [],
    };
    setSelectedItem(menuItem);
    setIsDrawerOpen(true);
  };

  const handleAddToCart = async (menuItemId: string, quantity: number) => {
    if (!cartData) return;
    const sessionId = cartData.sessionId || getSessionId();
    if (!sessionId) return;

    try {
      await addToCart({ sessionId, menuItemId, quantity });
      // Refresh cart data
      const response = await getCart(sessionId);
      if (response.success) {
        setCartData(response.data);
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  const handleUpdateCartItem = async (menuItemId: string, quantity: number) => {
    if (!cartData) return;
    const sessionId = cartData.sessionId || getSessionId();
    if (!sessionId) return;

    try {
      await updateCart({ sessionId, menuItemId, quantity });
      // Refresh cart data
      const response = await getCart(sessionId);
      if (response.success) {
        setCartData(response.data);
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  const handleRemoveFromCart = async (menuItemId: string) => {
    await handleRemoveItem(menuItemId);
  };

  const getCartQuantity = (menuItemId: string): number => {
    const cartItem = cartData?.cart.find(
      (item) => item.menuItem._id === menuItemId,
    );
    return cartItem?.quantity || 0;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">{t('Cart.title')}</h1>
        <p>{t('Cart.messages.loadingCart')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">{t('Cart.title')}</h1>
        <p className="text-red-500">{t('Cart.messages.errorLoadingCart')}</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (!cartData || cartData.cart.length === 0) {
    return (
      <div className="container mx-auto flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">{t('Cart.title')}</h1>
        <p className="text-muted-foreground">{t('Cart.messages.emptyCart')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t('Cart.title')}</h1>
        <p className="text-muted-foreground">
          {t('Common.tableNumber', { number: cartData.tableNumber })}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Cart Items */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('Cart.items')}</CardTitle>
              <CardDescription>
                {t('Cart.itemCount', { count: cartData.cart.length })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartData.cart.map((item: CartItemDetail, index: number) => (
                <div key={item.menuItem._id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div
                    className="flex gap-4"
                    onClick={() => handleItemClick(item)}
                  >
                    {/* Item Image */}
                    {item.menuItem.image ? (
                      <Image
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        width={80}
                        height={80}
                        sizes="80px"
                        unoptimized
                        className="size-20 shrink-0 cursor-pointer rounded-md object-cover transition-opacity hover:opacity-80"
                      />
                    ) : (
                      <div className="bg-muted size-20 shrink-0 cursor-pointer rounded-md transition-opacity hover:opacity-80" />
                    )}

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-semibold">{item.menuItem.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-muted-foreground text-sm italic">
                          {t('Cart.specialInstructions')}:{' '}
                          {item.specialInstructions}
                        </p>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive size-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item);
                        }}
                        disabled={
                          removingIds.has(item.menuItem._id) || isSubmitting
                        }
                        aria-label={t('Cart.ariaLabel.removeItem', {
                          itemName: item.menuItem.name,
                        })}
                      >
                        <Trash2Icon
                          className={
                            'size-4 ' +
                            (removingIds.has(item.menuItem._id)
                              ? 'animate-pulse'
                              : '')
                          }
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('Cart.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('Cart.subtotal')}
                  </span>
                  <span>${cartData.cartTotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t('Cart.total')}</span>
                  <span className="text-lg">
                    ${cartData.cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitOrderClick}
                disabled={cartData.cart.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : t('Cart.submitOrder')}
              </Button>

              {submitError && (
                <p className="text-destructive text-center text-xs">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-center text-xs text-green-600">
                  {submitSuccess}
                </p>
              )}

              <p className="text-muted-foreground text-center text-xs">
                {t('Cart.messages.submitOrderInfo')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Item Drawer */}
      <MenuItemDrawer
        item={selectedItem}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        cartQuantity={selectedItem ? getCartQuantity(selectedItem._id) : 0}
        onAdd={handleAddToCart}
        onUpdate={handleUpdateCartItem}
        onRemove={handleRemoveFromCart}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t('Cart.confirmDelete')}
        description={
          itemToDelete
            ? t('Cart.confirmDeleteDescription', {
                itemName: itemToDelete.menuItem.name,
                quantity: itemToDelete.quantity,
              })
            : ''
        }
        cancelText={t('Cart.cancel')}
        confirmText={t('Cart.delete')}
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />

      {/* Submit Order Confirmation Dialog */}
      <ConfirmationDialog
        open={showSubmitConfirm}
        onOpenChange={setShowSubmitConfirm}
        title={t('Cart.confirmSubmitOrder')}
        description={t('Cart.confirmSubmitOrderDescription', {
          total: cartData.cartTotal.toFixed(2),
          itemCount: cartData.cart.length,
        })}
        cancelText={t('Cart.cancel')}
        confirmText={t('Cart.submitOrder')}
        onConfirm={handleConfirmSubmitOrder}
      />
    </div>
  );
}
