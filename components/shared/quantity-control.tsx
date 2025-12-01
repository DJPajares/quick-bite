'use client';

import { use, useEffect, useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

interface QuantityControlProps {
  menuItemId: string;
  initialQuantity?: number;
  disabled?: boolean;
  onQuantityChange?: (quantity: number) => void;
  onAdd?: (menuItemId: string, quantity: number) => Promise<void>;
  onUpdate?: (menuItemId: string, quantity: number) => Promise<void>;
  onRemove?: (menuItemId: string) => Promise<void>;
}

export function QuantityControl({
  menuItemId,
  initialQuantity = 0,
  disabled = false,
  onQuantityChange,
  onAdd,
  onUpdate,
  onRemove,
}: QuantityControlProps) {
  const t = useTranslations();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [inputValue, setInputValue] = useState(initialQuantity.toString());
  const [isLoading, setIsLoading] = useState(false);

  // Sync internal state when parent-provided initialQuantity changes
  useEffect(() => {
    setQuantity(initialQuantity);
    setInputValue(initialQuantity.toString());
  }, [initialQuantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0 || isLoading || disabled) return;

    setIsLoading(true);
    let prev = quantity;
    try {
      prev = quantity;
      setQuantity(newQuantity);

      // Trigger callback
      onQuantityChange?.(newQuantity);

      // Handle API calls based on quantity changes
      if (prev === 0 && newQuantity > 0) {
        // Adding to cart for the first time
        await onAdd?.(menuItemId, newQuantity);
      } else if (newQuantity === 0) {
        // Removing from cart
        await onRemove?.(menuItemId);
      } else {
        // Updating quantity
        await onUpdate?.(menuItemId, newQuantity);
      }
    } catch (error) {
      // Revert on error
      console.error('Failed to update quantity:', error);
      setQuantity(prev);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setInputValue(newQuantity.toString());
    handleQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setInputValue(newQuantity.toString());
      handleQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input or valid numbers for editing
    if (value === '' || /^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Reset to 0 if input is empty on blur
    if (value === '') {
      setInputValue('0');
      handleQuantityChange(0);
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setInputValue(numValue.toString());
      handleQuantityChange(numValue);
    } else {
      // Revert to current quantity if invalid
      setInputValue(quantity.toString());
    }
  };

  if (quantity === 0) {
    return (
      <Button
        size="sm"
        onClick={handleIncrement}
        disabled={disabled || isLoading}
        className="w-full"
      >
        <PlusIcon className="mr-1 size-4" />
        {t('Common.add')}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        onClick={handleDecrement}
        disabled={disabled || isLoading}
        className="size-8 shrink-0"
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-4" />
      </Button>

      <Input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled || isLoading}
        className="h-8 w-12 text-center"
        aria-label="Quantity"
      />

      <Button
        size="icon"
        variant="outline"
        onClick={handleIncrement}
        disabled={disabled || isLoading}
        className="size-8 shrink-0"
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
}
