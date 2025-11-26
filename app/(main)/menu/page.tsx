'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { API_ENDPOINTS, apiClient, getErrorMessage } from '@/lib/api';
import { MenuItem, MenuResponse } from '@/types/api';

export default function MenuPage() {
  const t = useTranslations();
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

  /**
   * Group menu items by their category.
   * Categories are returned alphabetically.
   * Each group exposes a translated category object.
   */
  const groupMenuByCategory = (menuItems: MenuItem[]) => {
    const map = new Map<string, MenuItem[]>();
    for (const item of menuItems) {
      const categoryValue = item.category.trim();
      const items = map.get(categoryValue) || [];
      items.push(item);
      map.set(categoryValue, items);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([categoryValue, items]) => {
        let label: string;

        try {
          label = t(`Menu.categories.${categoryValue}`);
        } catch {
          label = categoryValue;
        }

        return {
          category: {
            value: categoryValue,
            label,
          },
          items,
        };
      });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold">{t('Menu.title')}</h1>

      <p className="text-muted-foreground">{t('Menu.description')}</p>
      {/* Menu items would be listed here */}
      {isLoading && <p>{t('Messages.loadingMenu')}</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && menu.length === 0 && (
        <p className="text-muted-foreground mt-4 text-sm">
          {t('Messages.noMenuItems')}
        </p>
      )}

      {!isLoading && !error && menu.length > 0 && (
        <div className="mt-6 space-y-8">
          {groupMenuByCategory(menu).map(({ category, items }) => (
            <section key={category.value || 'uncategorized'}>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                {category.label}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item._id}>
                    <CardHeader className="px-4">
                      <CardTitle className="line-clamp-1">
                        {item.name}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className="line-clamp-2">
                          {item.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="relative mt-auto flex-1">
                      <div>
                        <p className="mt-2 font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.available ? (
                          <span className="font-medium text-green-600">
                            {t('Menu.available')}
                          </span>
                        ) : (
                          <span className="font-medium text-red-600">
                            {t('Menu.unavailable')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
