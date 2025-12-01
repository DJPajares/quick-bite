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

export interface CartItemDetail {
  menuItem: {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  quantity: number;
  price: number;
  specialInstructions: string;
}

export interface CartData {
  sessionId: string;
  tableNumber: number;
  cart: CartItemDetail[];
  cartTotal: number;
}

export interface GetCartResponse {
  success: boolean;
  data: CartData;
}

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

// Order submission
export interface SubmitOrderRequest {
  sessionId: string;
  notes: string;
}

export interface SubmitOrderResponse {
  success: boolean;
  data?: {
    orderId: string;
    status: string;
  };
  message?: string;
}

/**
 * Admin Types
 */

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'kitchen-staff';
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  sessionId: string;
  tableNumber: number;
  items: {
    menuItem: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    price: number;
    specialInstructions?: string;
  }[];
  status: string;
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminOrdersResponse = ApiResponse<AdminOrder[]>;

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  data?: AdminOrder;
  message?: string;
}

export interface InventoryItem {
  _id: string;
  menuItemId: string;
  menuItemName: string;
  stockLevel: number;
  unit: string;
  lowStockThreshold: number;
  lastRestocked?: string;
  updatedAt: string;
}

export type InventoryResponse = ApiResponse<InventoryItem[]>;

export interface UpdateInventoryRequest {
  stockLevel: number;
}

export interface UpdateInventoryResponse {
  success: boolean;
  data?: InventoryItem;
  message?: string;
}

export interface DashboardAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersToday: number;
  revenueToday: number;
  popularItems: {
    menuItemId: string;
    name: string;
    orderCount: number;
    revenue: number;
  }[];
  recentOrders: AdminOrder[];
}

export interface DashboardAnalyticsResponse {
  success: boolean;
  data: DashboardAnalytics;
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available?: boolean;
  tags?: string[];
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  available?: boolean;
  tags?: string[];
}

export interface MenuItemResponse {
  success: boolean;
  data?: MenuItem;
  message?: string;
}
