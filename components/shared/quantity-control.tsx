'use client';

import { useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0 || isLoading || disabled) return;

    setIsLoading(true);
    try {
      const oldQuantity = quantity;
      setQuantity(newQuantity);

      // Trigger callback
      onQuantityChange?.(newQuantity);

      // Handle API calls based on quantity changes
      if (oldQuantity === 0 && newQuantity > 0) {
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
      setQuantity(quantity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for editing
    if (value === '') {
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      handleQuantityChange(numValue);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Reset to 0 if input is empty on blur
    if (value === '') {
      handleQuantityChange(0);
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
        Add
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
        type="number"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled || isLoading}
        className="h-8 w-16 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min="0"
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
