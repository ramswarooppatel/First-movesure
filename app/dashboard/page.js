"use client";
import { useAuth } from '@/context/AuthContext';
import { AuthStorage } from '@/utils/authStorage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  const { isAuthenticated, authInitialized } = useAuth();

  // Quick check for authenticated users to prevent unnecessary loaders
  if (authInitialized && (isAuthenticated || AuthStorage.isAuthenticated())) {
    return (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    );
  }

  // Show minimal loading for initial auth check
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}