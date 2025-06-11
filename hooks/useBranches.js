"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BranchService } from '@/services/branchService';

export function useBranches() {
  const { user, getAuthHeaders } = useAuth();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const getCompanyId = useCallback(() => {
    return user?.company_id || user?.companyId || user?.company?.id || user?.profile?.company_id;
  }, [user]);

  const fetchBranches = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID not available');
      }

      const response = await BranchService.getBranches({
        companyId,
        ...params
      });

      setBranches(response.branches || []);
      setPagination(response.pagination || {});
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.message);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [getCompanyId]);

  const createBranch = useCallback(async (branchData) => {
    try {
      setLoading(true);
      const result = await BranchService.createBranch(branchData, getAuthHeaders());
      
      if (result.success) {
        await fetchBranches(); // Refresh the list
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, fetchBranches]);

  const updateBranch = useCallback(async (branchId, updateData) => {
    try {
      setLoading(true);
      const result = await BranchService.updateBranch(branchId, updateData, getAuthHeaders());
      
      if (result.success) {
        await fetchBranches(); // Refresh the list
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, fetchBranches]);

  const deleteBranch = useCallback(async (branchId) => {
    try {
      setLoading(true);
      const result = await BranchService.deleteBranch(branchId, getAuthHeaders());
      
      if (result.success) {
        await fetchBranches(); // Refresh the list
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, fetchBranches]);

  useEffect(() => {
    const companyId = getCompanyId();
    if (companyId) {
      fetchBranches();
    }
  }, [getCompanyId, fetchBranches]);

  return {
    branches,
    loading,
    error,
    pagination,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    refetch: fetchBranches
  };
}