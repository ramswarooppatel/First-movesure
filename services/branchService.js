export class BranchService {
  static async getBranches(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.is_head_office && params.is_head_office !== 'all') queryParams.append('is_head_office', params.is_head_office);
      if (params.city) queryParams.append('city', params.city);
      if (params.state) queryParams.append('state', params.state);
      if (params.companyId) queryParams.append('companyId', params.companyId);

      const url = `/api/branches?${queryParams.toString()}`;
      
      console.log('Fetching branches from:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch branches: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Branches fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  static async createBranch(branchData, headers = {}) {
    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(branchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create branch');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating branch:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateBranch(branchId, updateData, headers = {}) {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update branch');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating branch:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteBranch(branchId, headers = {}) {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete branch');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting branch:', error);
      return { success: false, error: error.message };
    }
  }
}

export default BranchService;