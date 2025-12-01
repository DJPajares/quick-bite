/**
 * Admin authentication utilities for JWT-based auth
 * Manages token storage and retrieval for admin users
 */

const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'kitchen';
}

interface LoginResponse {
  token: string;
  user: AdminUser;
}

/**
 * Store admin token and user data in sessionStorage
 */
export function setAdminAuth(data: LoginResponse): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, data.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

/**
 * Get stored admin token
 */
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored admin user data
 */
export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = sessionStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAdminToken();
}

/**
 * Clear admin authentication data
 */
export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Login admin user
 */
export async function loginAdmin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  setAdminAuth(data);
  return data;
}

/**
 * Logout admin user
 */
export function logoutAdmin(): void {
  clearAdminAuth();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
}

/**
 * Verify current token is valid
 */
export async function verifyToken(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    const response = await fetch(`${API_BASE_URL}/auth/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      clearAdminAuth();
      return null;
    }

    const data = await response.json();
    // Backend returns { user: { ... } }
    return data.user || data;
  } catch {
    clearAdminAuth();
    return null;
  }
}
