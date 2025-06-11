"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated, loading, hasPermission } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requiredRole && hasPermission && !hasPermission(requiredRole)) {
        router.push('/unauthorized');
        return;
      }

      setIsAuthorized(true);
    }
  }, [isAuthenticated, loading, user, requiredRole, router, hasPermission]);

  if (loading) {
    return <Loader isLoading={true} message="Loading dashboard..." />;
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}