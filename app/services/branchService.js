class BranchService {
  static async getBranches(params = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        status = 'all',
        is_head_office = 'all',
        city = '',
        state = '',
        companyId = null
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        is_head_office,
        city,
        state
      });

      const headers = {
        'Content-Type': 'application/json',
      };

      // FIXED: Add company ID to headers properly
      if (companyId) {
        headers['x-company-id'] = companyId.toString();
      }

      console.log('Fetching branches with headers:', headers); // Debug log
      console.log('Company ID being sent:', companyId); // Debug log

      const response = await fetch(`/api/branches?${queryParams}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData); // Debug log
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  static async createBranch(branchData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add company ID to headers if provided
      if (branchData.companyId) {
        headers['x-company-id'] = branchData.companyId.toString();
      }

      const response = await fetch('/api/branches', {
        method: 'POST',
        headers,
        body: JSON.stringify(branchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create branch');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  static async updateBranch(branchId, updateData) {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update branch');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  static async deleteBranch(branchId) {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete branch');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

export default BranchService;