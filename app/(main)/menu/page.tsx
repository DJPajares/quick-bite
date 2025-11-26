'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { API_ENDPOINTS, apiClient, getErrorMessage } from '@/lib/api';
import { MenuItem, MenuResponse } from '@/types/api';
import { useEffect, useRef, useState } from 'react';

export default function MenuPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Prevent duplicate calls from React Strict Mode and dual layout rendering
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<MenuResponse>(API_ENDPOINTS.menu);

        const { data, success } = response.data;

        if (success) {
          setMenu(data);
        } else {
          setError('Failed to fetch menu data');
        }
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Error fetching menu:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const sortMenuByCategory = (menuItems: MenuItem[]) => {
    return menuItems.slice().sort((a, b) => {
      const categoryA = a.category || '';
      const categoryB = b.category || '';
      return categoryA.localeCompare(categoryB);
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold">Menu</h1>

      <p className="text-muted-foreground">
        Explore our delicious offerings and find your next favorite dish!
      </p>

      {/* Menu items would be listed here */}
      {isLoading && <p>Loading menu...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortMenuByCategory(menu).map((item) => (
            <Card key={item._id}>
              <CardHeader className="px-4">
                <CardTitle>{item.name}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="relative mt-auto flex-1">
                <div>
                  <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
                  {item.available ? (
                    <span className="font-medium text-green-600">
                      Available
                    </span>
                  ) : (
                    <span className="font-medium text-red-600">
                      Unavailable
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
