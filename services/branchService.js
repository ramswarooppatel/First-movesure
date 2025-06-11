export class BranchService {
  static async getBranches(params = {}, headers = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 12,
        search: params.search || '',
        status: params.status || 'all',
        is_head_office: params.is_head_office || 'all',
        city: params.city || '',
        state: params.state || ''
      });

      const response = await fetch(`/api/branches?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching branches:', error);
      return { success: false, error: 'Failed to fetch branches' };
    }
  }

  static async createBranch(branchData, headers = {}) {
    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(branchData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating branch:', error);
      return { success: false, error: 'Failed to create branch' };
    }
  }

  static async updateBranch(branchId, branchData, headers = {}) {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(branchData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating branch:', error);
      return { success: false, error: 'Failed to update branch' };
    }
  }

  static async deleteBranch(branchId, headers = {}) {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error deleting branch:', error);
      return { success: false, error: 'Failed to delete branch' };
    }
  }

  static async exportBranches(filters = {}, headers = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/branches/export?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        return { success: true, data: blob };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error exporting branches:', error);
      return { success: false, error: 'Failed to export branches' };
    }
  }
}