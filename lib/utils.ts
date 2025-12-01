import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { APP_CONSTANTS } from '@/constants/app';
import { CURRENCY_LOCALE_MAPPING } from '@/constants/currencyLocaleMapping';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortCategoriesByPreferredOrder = (
  a: string,
  b: string,
  preferredOrder: readonly string[] = APP_CONSTANTS.PREFERRED_CATEGORY_ORDER,
) => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  const aIndex = preferredOrder.indexOf(aLower);
  const bIndex = preferredOrder.indexOf(bLower);
  // Both in preferred order
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }
  // Only a in preferred order
  if (aIndex !== -1) {
    return -1;
  }
  // Only b in preferred order
  if (bIndex !== -1) {
    return 1;
  }
  // Neither in preferred order, sort alphabetically
  return a.localeCompare(b);
};

type ExtendedNumberFormatOptions = Intl.NumberFormatOptions & {
  roundingPriority?: 'auto' | 'morePrecision' | 'lessPrecision' | undefined;
  roundingIncrement?:
    | 1
    | 2
    | 5
    | 10
    | 20
    | 25
    | 50
    | 100
    | 200
    | 250
    | 500
    | 1000
    | 2000
    | 2500
    | 5000
    | undefined;
  roundingMode?:
    | 'ceil'
    | 'floor'
    | 'expand'
    | 'trunc'
    | 'halfCeil'
    | 'halfFloor'
    | 'halfExpand'
    | 'halfTrunc'
    | 'halfEven'
    | undefined;
  trailingZeroDisplay?: 'auto' | 'stripIfInteger' | undefined;
};

type FormatCurrencyProps = {
  value: number;
  currency?: string;
  decimal?: number;
};

export const formatCurrency = ({
  value,
  currency = 'USD',
  decimal = 2,
}: FormatCurrencyProps) => {
  const locale =
    CURRENCY_LOCALE_MAPPING[currency as keyof typeof CURRENCY_LOCALE_MAPPING];

  const options: ExtendedNumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
    trailingZeroDisplay: 'stripIfInteger',
    roundingMode: 'ceil',
  };

  return new Intl.NumberFormat(locale, options).format(value);
};
