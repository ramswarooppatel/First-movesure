import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export class BranchStaffService {
  static async getBranchStaffCount(branchId) {
    try {
      console.log('Fetching staff count for branch:', branchId);
      
      const response = await fetch(`/api/branches/${branchId}/staff`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch staff count' };
      }

      const result = await response.json();
      return { success: true, count: result.stats?.total || 0 };
    } catch (error) {
      console.error('Staff count service error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getBranchStaffDetails(branchId) {
    try {
      console.log('Fetching staff details for branch:', branchId);
      
      const response = await fetch(`/api/branches/${branchId}/staff`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch staff details' };
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data || [],
        stats: result.stats || {
          total: 0,
          active: 0,
          inactive: 0,
          roles: {
            super_admin: 0,
            admin: 0,
            branch_manager: 0,
            branch_staff: 0,
            viewer: 0
          }
        }
      };
    } catch (error) {
      console.error('Staff details service error:', error);
      return { success: false, error: error.message };
    }
  }
}