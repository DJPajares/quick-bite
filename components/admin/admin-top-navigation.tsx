'use client';

import { useTranslations } from 'next-intl';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

export function AdminTopNavigation() {
  const pathname = usePathname();
  const t = useTranslations('Admin.nav');

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 1) return null; // Just '/admin'

    const breadcrumbs = segments.slice(1).map((segment, index) => {
      const href = '/' + segments.slice(0, index + 2).join('/');
      const isLast = index === segments.length - 2;

      return {
        label: t(segment),
        href,
        isLast,
      };
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {breadcrumbs && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={breadcrumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                {breadcrumb.isLast ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumb.href}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </header>
  );
}
