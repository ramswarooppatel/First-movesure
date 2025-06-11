"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const useNavigation = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const navigateTo = (path) => {
    // For authenticated users, navigate immediately without showing loader
    if (isAuthenticated) {
      router.push(path);
    } else {
      router.push(path);
    }
  };

  return { navigateTo };
};