"use client";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BranchManagement from '@/components/branches/BranchManagement';

export default function BranchesPage() {
  return (
    <ProtectedRoute>
      <BranchManagement />
    </ProtectedRoute>
  );
}