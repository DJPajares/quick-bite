/**
 * Application constants for non-translatable text
 * These values should remain consistent across all languages
 */
export const APP_CONSTANTS = {
  /**
   * The application name
   */
  APP_NAME: 'Quick Bite',

  /**
   * The application tagline or slogan
   */
  APP_TAGLINE: 'A fast and easy food ordering app.',

  /**
   * Company or brand related constants
   */
  BRAND: {
    NAME: 'Quick Bite',
    SHORT_NAME: 'QB',
  },

  /**
   * Menu category ordering
   * Categories will be displayed in this order, with others sorted alphabetically after
   */
  PREFERRED_CATEGORY_ORDER: [
    'appetizers',
    'main-course',
    'desserts',
    'sides',
    'beverages',
  ],
} as const;
