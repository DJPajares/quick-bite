'use client';

import { useEffect, useRef, useState } from 'react';
import { useDeferredValue, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { SearchIcon, XIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MenuItemCard } from '@/components/shared/menu-item-card';
import { MenuItemDrawer } from '@/components/shared/menu-item-drawer';

import { sortCategoriesByPreferredOrder } from '@/lib/utils';
import {
  API_ENDPOINTS,
  apiClient,
  getErrorMessage,
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
} from '@/lib/api';
import { getSessionId } from '@/lib/session';

import { MenuItem, MenuResponse } from '@/types/api';

export default function MenuPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart state - tracks quantity for each menu item
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(
    {},
  );

  // Drawer state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Prevent duplicate calls from React Strict Mode and dual layout rendering
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMenuAndCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [menuRes, cartRes] = await Promise.all([
          apiClient.get<MenuResponse>(API_ENDPOINTS.menu),
          getCart(getSessionId()),
        ]);

        const { data: menuData, success: menuSuccess } = menuRes.data;
        if (menuSuccess) {
          setMenu(menuData);
        } else {
          setError('Failed to fetch menu data');
        }

        if (cartRes.success && Array.isArray(cartRes.data?.cart)) {
          const cartMap: Record<string, number> = {};
          for (const cartItem of cartRes.data.cart) {
            const id = cartItem?.menuItem?._id;
            const qty = cartItem?.quantity ?? 0;
            if (id && qty > 0) {
              cartMap[id] = qty;
            }
          }
          setCartQuantities(cartMap);
        }
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Error fetching menu/cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuAndCart();
  }, []);

  /**
   * Group menu items by their category.
   * Categories are sorted by preferred order, then alphabetically.
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
      .sort(([a], [b]) => sortCategoriesByPreferredOrder(a, b))
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

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    menu.forEach((item) => {
      if (item.category?.trim()) {
        categorySet.add(item.category.trim());
      }
    });

    return Array.from(categorySet).sort(sortCategoriesByPreferredOrder);
  }, [menu]);

  const filteredMenu = useMemo(() => {
    let items = menu;

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(
        (item) => item.category?.trim() === selectedCategory,
      );
    }

    // Filter by search query
    const q = deferredQuery.trim().toLowerCase();
    if (q) {
      const matches = (item: MenuItem) => {
        const name = item.name?.toLowerCase() ?? '';
        const category = item.category?.toLowerCase() ?? '';
        const description = item.description?.toLowerCase() ?? '';
        const tags = Array.isArray(item.tags)
          ? item.tags.map((t) => (t ?? '').toLowerCase())
          : [];

        if (name.includes(q)) return true;
        if (category.includes(q)) return true;
        if (description.includes(q)) return true;
        if (tags.some((t) => t.includes(q))) return true;
        return false;
      };

      items = items.filter(matches);
    }

    return items;
  }, [menu, selectedCategory, deferredQuery]);

  // Cart handlers
  const handleAddToCart = async (menuItemId: string, quantity: number) => {
    const sessionId = getSessionId();
    await addToCart({ sessionId, menuItemId, quantity });
    setCartQuantities((prev) => ({ ...prev, [menuItemId]: quantity }));
  };

  const handleUpdateCart = async (menuItemId: string, quantity: number) => {
    const sessionId = getSessionId();
    await updateCart({ sessionId, menuItemId, quantity });
    setCartQuantities((prev) => ({ ...prev, [menuItemId]: quantity }));
  };

  const handleRemoveFromCart = async (menuItemId: string) => {
    const sessionId = getSessionId();
    await removeFromCart({ sessionId, menuItemId });
    setCartQuantities((prev) => {
      const updated = { ...prev };
      delete updated[menuItemId];
      return updated;
    });
  };

  const handleCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <>
      <MenuItemDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        cartQuantity={selectedItem ? cartQuantities[selectedItem._id] || 0 : 0}
        onAdd={handleAddToCart}
        onUpdate={handleUpdateCart}
        onRemove={handleRemoveFromCart}
      />

      <div className="container mx-auto flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">{t('Menu.title')}</h1>

        <p className="text-muted-foreground">{t('Menu.description')}</p>

        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          <Input
            className="pr-8 pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Menu.messages.searchPlaceholder')}
            aria-label={t('Menu.messages.searchAriaLabel')}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="ring-offset-background focus:ring-ring absolute top-1/2 right-2 -translate-y-1/2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
              aria-label={t('Menu.messages.clearSearch')}
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {isLoading && <p>{t('Menu.messages.loadingMenu')}</p>}

        {error && <p className="text-red-500">Error: {error}</p>}

        {!isLoading && !error && menu.length === 0 && (
          <p className="text-muted-foreground mt-4 text-sm">
            {t('Menu.messages.noMenuItems')}
          </p>
        )}

        {!isLoading && !error && menu.length > 0 && (
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                {t('Menu.categories.all')}
              </Badge>

              {categories.map((category) => {
                let label: string;
                try {
                  label = t(`Menu.categories.${category}`);
                } catch {
                  label = category;
                }

                return (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>

            <div className="space-y-8">
              {filteredMenu.length === 0 && (
                <p className="text-muted-foreground mt-4 text-sm">
                  {t('Menu.messages.noSearchResults')}
                </p>
              )}
              {groupMenuByCategory(filteredMenu).map(({ category, items }) => (
                <section key={category.value || 'uncategorized'}>
                  <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                    {category.label}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item._id}
                        item={item}
                        cartQuantity={cartQuantities[item._id] || 0}
                        onAdd={handleAddToCart}
                        onUpdate={handleUpdateCart}
                        onRemove={handleRemoveFromCart}
                        onClick={() => handleCardClick(item)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
