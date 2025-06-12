import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useBranchStaff() {
  const [staffData, setStaffData] = useState(null);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState(null);
  const { getAuthHeaders } = useAuth();

  const fetchBranchStaff = useCallback(async (branchId) => {
    try {
      setStaffLoading(true);
      setStaffError(null);
      
      console.log('Fetching staff data for branch:', branchId);
      
      const headers = getAuthHeaders();
      const response = await fetch(`/api/branches/${branchId}/staff`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch staff data');
      }

      const result = await response.json();
      
      if (result.success) {
        setStaffData(result);
        console.log('Staff data loaded successfully:', result);
      } else {
        throw new Error(result.error || 'Failed to load staff data');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setStaffError(error.message);
      throw error;
    } finally {
      setStaffLoading(false);
    }
  }, [getAuthHeaders]);

  return {
    staffData,
    staffLoading,
    staffError,
    fetchBranchStaff,
    setStaffData,
    setStaffError
  };
}