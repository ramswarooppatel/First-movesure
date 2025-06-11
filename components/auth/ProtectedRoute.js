"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { AuthStorage } from '@/utils/authStorage';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, loading, authInitialized, hasPermission, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log('ProtectedRoute: Checking authentication...', {
        authInitialized,
        isAuthenticated,
        loading,
        pathname
      });

      // Wait for auth to be initialized
      if (!authInitialized) {
        return;
      }

      setCheckingAuth(false);

      // Double-check with localStorage as fallback
      const storageAuth = AuthStorage.isAuthenticated();
      const isUserAuthenticated = isAuthenticated || storageAuth;

      if (!isUserAuthenticated) {
        console.log('ProtectedRoute: User not authenticated, redirecting to login');
        router.push('/login');
        return;
      }

      if (requiredRole && hasPermission && !hasPermission(requiredRole)) {
        console.log('ProtectedRoute: User lacks required permissions');
        router.push('/unauthorized');
        return;
      }

      console.log('ProtectedRoute: User authorized');
      setIsAuthorized(true);
    };

    checkAuthentication();
  }, [isAuthenticated, authInitialized, loading, user, requiredRole, router, hasPermission, pathname]);

  // Show loading while checking authentication
  if (!authInitialized || checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authorized (redirect will happen)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
}