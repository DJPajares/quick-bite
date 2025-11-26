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
  // Add more endpoints as needed
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
