'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, verifyToken } from '@/lib/admin-auth';
import { Spinner } from '@/components/ui/spinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AdminAuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      if (!isAuthenticated()) {
        router.replace('/admin/login');
        return;
      }

      try {
        const user = await verifyToken();
        if (!user) {
          router.replace('/admin/login');
          return;
        }
        setIsAuthorized(true);
      } catch {
        router.replace('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
