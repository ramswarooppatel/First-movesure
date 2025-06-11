"use client";
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current page should use dashboard layout
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  if (isDashboardPage) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </ProtectedRoute>
    );
  }
  
  // For non-dashboard pages, render children directly
  return children;
}