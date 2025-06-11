import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export const useAuthenticatedFetch = () => {
  const { getAuthHeaders, refreshAuthToken, logout } = useAuth();
  const router = useRouter();

  const authenticatedFetch = async (url, options = {}) => {
    try {
      const headers = {
        ...getAuthHeaders(),
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken();
        
        if (refreshed) {
          // Retry with new token
          const retryHeaders = {
            ...getAuthHeaders(),
            ...options.headers
          };
          
          return fetch(url, {
            ...options,
            headers: retryHeaders
          });
        } else {
          // Refresh failed, logout and redirect
          logout();
          return response;
        }
      }

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  return { authenticatedFetch };
};