class StaffService {
  static async getStaffByBranch(params = {}) {
    try {
      const {
        branchId,
        companyId,
        page = 1,
        limit = 10,
        search = '',
        role = 'all',
        isActive = 'all'
      } = params;

      console.log('StaffService - getStaffByBranch params:', params);

      if (!branchId) {
        throw new Error(`Branch ID is required: branchId=${branchId}`);
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        role,
        is_active: isActive,
        branch_id: branchId.toString()
      });

      // Add company_id as fallback in URL params only if provided
      if (companyId) {
        queryParams.append('company_id', companyId.toString());
      }

      const headers = {
        'Content-Type': 'application/json',
        'x-branch-id': branchId.toString()
      };

      // Add company ID header only if provided
      if (companyId) {
        headers['x-company-id'] = companyId.toString();
      }

      console.log('StaffService - Request headers:', headers);
      console.log('StaffService - Query params:', queryParams.toString());

      const response = await fetch(`/api/staff/branch?${queryParams}`, {
        method: 'GET',
        headers,
      });

      console.log('StaffService - Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('StaffService - Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('StaffService - Success response:', data);
      
      return data;
    } catch (error) {
      console.error('StaffService - Error fetching staff by branch:', error);
      throw error;
    }
  }

  static async getStaffDetails(staffId, companyId) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (companyId) {
        headers['x-company-id'] = companyId.toString();
      }

      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch staff details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching staff details:', error);
      throw error;
    }
  }

  static async getAllStaff(params = {}) {
    try {
      const {
        companyId,
        page = 1,
        limit = 20,
        search = '',
        role = 'all',
        branchId = 'all',
        isActive = 'all'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        role,
        branch_id: branchId,
        is_active: isActive
      });

      const headers = {
        'Content-Type': 'application/json',
      };

      if (companyId) {
        headers['x-company-id'] = companyId.toString();
      }

      const response = await fetch(`/api/staff?${queryParams}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch staff');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all staff:', error);
      throw error;
    }
  }
}

export default StaffService;