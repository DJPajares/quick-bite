export interface CategoryOption {
  value: string;
  labelKey: string;
}

export const MENU_CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { value: 'appetizers', labelKey: 'appetizers' },
  { value: 'main-course', labelKey: 'main-course' },
  { value: 'desserts', labelKey: 'desserts' },
  { value: 'sides', labelKey: 'sides' },
  { value: 'beverages', labelKey: 'beverages' },
] as const;
