"use client";
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StaffManagement from '@/components/staff/StaffManagement';

export default function StaffPage() {
  return (
    <ProtectedRoute>
      <StaffManagement />
    </ProtectedRoute>
  );
}