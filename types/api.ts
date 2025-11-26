/**
 * API Response Types
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type MenuResponse = ApiResponse<MenuItem[]>;

/**
 * Cart Types
 */

export interface CartItem {
  menuItemId: string;
  quantity: number;
}

export interface AddToCartRequest {
  sessionId: string;
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  sessionId: string;
  menuItemId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  sessionId: string;
  menuItemId: string;
}

export interface CartResponse {
  success: boolean;
  data?: {
    items: CartItem[];
  };
  message?: string;
}
