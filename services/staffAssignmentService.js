export class StaffAssignmentService {
  static async getStaffForAssignment(searchParams = {}, headers = {}) {
    try {
      const params = new URLSearchParams();
      
      if (searchParams.search) params.append('search', searchParams.search);
      if (searchParams.role) params.append('role', searchParams.role);
      if (searchParams.include_assigned) params.append('include_assigned', searchParams.include_assigned);
      if (searchParams.current_branch) params.append('current_branch', searchParams.current_branch);

      const response = await fetch(`/api/staff/unassigned?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch staff');
      }

      const result = await response.json();
      return { success: true, data: result.data, total: result.total };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return { success: false, error: error.message };
    }
  }

  // Keep the old method for backward compatibility
  static async getUnassignedStaff(searchParams = {}, headers = {}) {
    return this.getStaffForAssignment({
      ...searchParams,
      include_assigned: 'false'
    }, headers);
  }

  static async assignStaffToBranch(branchId, staffIds, headers = {}) {
    try {
      const response = await fetch(`/api/branches/${branchId}/assign-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ staffIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign staff to branch');
      }

      const result = await response.json();
      return { success: true, data: result.data, message: result.message };
    } catch (error) {
      console.error('Error assigning staff to branch:', error);
      return { success: false, error: error.message };
    }
  }

  static async removeStaffFromBranch(staffIds, headers = {}) {
    try {
      const response = await fetch('/api/staff/unassign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ staffIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove staff from branch');
      }

      const result = await response.json();
      return { success: true, data: result.data, message: result.message };
    } catch (error) {
      console.error('Error removing staff from branch:', error);
      return { success: false, error: error.message };
    }
  }
}