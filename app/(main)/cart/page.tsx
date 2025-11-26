'use client';

import { useEffect, useRef, useState } from 'react';
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

import { getCart, getErrorMessage, submitOrder } from '@/lib/api';
import { getSessionId } from '@/lib/session';

import type { CartData, CartItemDetail } from '@/types/api';

export default function CartPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartData | null>(null);
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

  const handleSubmitOrder = async () => {
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
    <div className="container mx-auto flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">{t('Cart.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('Cart.tableNumber', { number: cartData.tableNumber })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
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
                  <div className="flex gap-4">
                    {/* Item Image Placeholder */}
                    <div className="bg-muted size-20 shrink-0 rounded-md" />

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
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
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
                onClick={handleSubmitOrder}
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
    </div>
  );
}
