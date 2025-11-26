import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { APP_CONSTANTS } from '@/constants/app';

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
