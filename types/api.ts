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
  description?: string;
  price: number;
  category?: string;
  image?: string;
  available?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type MenuResponse = ApiResponse<MenuItem[]>;
