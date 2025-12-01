import axios from 'axios';
import type {
  AddToCartRequest,
  UpdateCartRequest,
  RemoveFromCartRequest,
  CartResponse,
  GetCartResponse,
  SubmitOrderRequest,
  SubmitOrderResponse,
} from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add admin token for admin API requests
apiClient.interceptors.request.use(async (config) => {
  // Check if this is an admin API request
  if (
    config.url?.startsWith('/admin') ||
    config.url?.startsWith('/auth/admin/me')
  ) {
    // Get JWT token from sessionStorage
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export const API_ENDPOINTS = {
  menu: '/menu',
  cart: {
    get: (sessionId: string) => `/cart/${sessionId}`,
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
  },
  orders: {
    submit: '/orders/submit',
  },
  bills: {
    get: (sessionId: string) => `/bill/${sessionId}`,
  },
  admin: {
    orders: {
      list: '/admin/orders',
      get: (id: string) => `/admin/orders/${id}`,
      updateStatus: (id: string) => `/admin/orders/${id}/status`,
    },
    menu: {
      list: '/admin/menu',
      create: '/admin/menu',
      update: (id: string) => `/admin/menu/${id}`,
      delete: (id: string) => `/admin/menu/${id}`,
    },
    inventory: {
      list: '/admin/inventory',
      update: (id: string) => `/admin/inventory/${id}`,
    },
    analytics: {
      dashboard: '/admin/analytics/dashboard',
    },
  },
} as const;

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Cart API functions
 */

export async function getCart(sessionId: string): Promise<GetCartResponse> {
  try {
    const response = await apiClient.get<GetCartResponse>(
      API_ENDPOINTS.cart.get(sessionId),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export async function addToCart(
  request: AddToCartRequest,
): Promise<CartResponse> {
  try {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.cart.add,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function updateCart(
  request: UpdateCartRequest,
): Promise<CartResponse> {
  try {
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.cart.update,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

export async function removeFromCart(
  request: RemoveFromCartRequest,
): Promise<CartResponse> {
  try {
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.cart.remove,
      { data: request },
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export async function submitOrder(
  request: SubmitOrderRequest,
): Promise<SubmitOrderResponse> {
  try {
    const response = await apiClient.post<SubmitOrderResponse>(
      API_ENDPOINTS.orders.submit,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
}

export async function getBill(sessionId: string) {
  try {
    const response = await apiClient.get(`/bill/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bill:', error);
    throw error;
  }
}

/**
 * Bill API functions
 */
export interface BillOrder {
  orderNumber: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  orderTotal: number;
}

export interface BillSummary {
  subtotal: number;
  tax: number;
  serviceFee: number;
  grandTotal: number;
}

export interface BillResponse {
  success: boolean;
  sessionId: string;
  tableNumber: number;
  orders: BillOrder[];
  summary: BillSummary;
}

export async function fetchBill(sessionId: string): Promise<BillResponse> {
  try {
    const response = await apiClient.get<BillResponse>(
      API_ENDPOINTS.bills.get(sessionId),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching bill:', error);
    throw error;
  }
}

/**
 * Admin API functions
 */
import type {
  AdminOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  MenuResponse,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  MenuItemResponse,
  InventoryResponse,
  UpdateInventoryRequest,
  UpdateInventoryResponse,
  DashboardAnalyticsResponse,
} from '@/types/api';

export function setAuthToken(token: string) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function removeAuthToken() {
  delete apiClient.defaults.headers.common['Authorization'];
}

// Orders
export async function getAdminOrders(params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AdminOrdersResponse> {
  try {
    const response = await apiClient.get<AdminOrdersResponse>(
      API_ENDPOINTS.admin.orders.list,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  request: UpdateOrderStatusRequest,
): Promise<UpdateOrderStatusResponse> {
  try {
    const response = await apiClient.patch<UpdateOrderStatusResponse>(
      API_ENDPOINTS.admin.orders.updateStatus(orderId),
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Menu Management
export async function getAdminMenu(): Promise<MenuResponse> {
  try {
    const response = await apiClient.get<MenuResponse>(
      API_ENDPOINTS.admin.menu.list,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching admin menu:', error);
    throw error;
  }
}

export async function createMenuItem(
  request: CreateMenuItemRequest,
): Promise<MenuItemResponse> {
  try {
    const response = await apiClient.post<MenuItemResponse>(
      API_ENDPOINTS.admin.menu.create,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
}

export async function updateMenuItem(
  itemId: string,
  request: UpdateMenuItemRequest,
): Promise<MenuItemResponse> {
  try {
    const response = await apiClient.patch<MenuItemResponse>(
      API_ENDPOINTS.admin.menu.update(itemId),
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

export async function deleteMenuItem(
  itemId: string,
): Promise<MenuItemResponse> {
  try {
    const response = await apiClient.delete<MenuItemResponse>(
      API_ENDPOINTS.admin.menu.delete(itemId),
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

// Inventory
export async function getInventory(): Promise<InventoryResponse> {
  try {
    const response = await apiClient.get<InventoryResponse>(
      API_ENDPOINTS.admin.inventory.list,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

export async function updateInventory(
  itemId: string,
  request: UpdateInventoryRequest,
): Promise<UpdateInventoryResponse> {
  try {
    const response = await apiClient.patch<UpdateInventoryResponse>(
      API_ENDPOINTS.admin.inventory.update(itemId),
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
}

// Analytics
export async function getDashboardAnalytics(): Promise<DashboardAnalyticsResponse> {
  try {
    const response = await apiClient.get<DashboardAnalyticsResponse>(
      API_ENDPOINTS.admin.analytics.dashboard,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    throw error;
  }
}
