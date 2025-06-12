export const StaffService = {
  async getStaff(params = {}, headers = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      console.log('StaffService: Making request with headers:', headers);
      console.log('StaffService: Query params:', queryParams.toString());

      const response = await fetch(`/api/staff?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('StaffService: API error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Staff service error:', error);
      return { success: false, error: error.message || 'Failed to fetch staff' };
    }
  },

  async getBranches(headers = {}) {
    try {
      const response = await fetch('/api/staff/branches', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get branches error:', error);
      return { success: false, error: 'Failed to fetch branches' };
    }
  },

  async createStaff(staffData, headers = {}) {
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(staffData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create staff error:', error);
      return { success: false, error: 'Failed to create staff member' };
    }
  },

  async updateStaff(staffId, staffData, headers) {
    try {
      console.log('🔄 Updating staff:', { staffId, staffData });

      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(staffData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Staff updated successfully:', result);
        return {
          success: true,
          data: result.data,
          message: result.message || 'Staff updated successfully'
        };
      } else {
        console.error('❌ Failed to update staff:', result);
        return {
          success: false,
          error: result.error || result.message || 'Failed to update staff'
        };
      }
    } catch (error) {
      console.error('❌ Update staff error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  },

  async deleteStaff(staffId, headers) {
    try {
      console.log('🗑️ Deleting staff:', { staffId });

      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          ...headers
        }
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Staff deleted successfully:', result);
        return {
          success: true,
          data: result.data,
          message: result.message || 'Staff deleted successfully'
        };
      } else {
        console.error('❌ Failed to delete staff:', result);
        return {
          success: false,
          error: result.error || result.message || 'Failed to delete staff'
        };
      }
    } catch (error) {
      console.error('❌ Delete staff error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  },

  async exportStaff(filters = {}, headers = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`/api/staff/export?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          ...headers
        }
      });

      if (response.ok) {
        const csvData = await response.text();
        return { success: true, data: csvData };
      } else {
        return { success: false, error: 'Export failed' };
      }
    } catch (error) {
      console.error('Export staff error:', error);
      return { success: false, error: 'Failed to export staff data' };
    }
  },

  // Excel upload functionality (updated to work without multer)
  async uploadStaffExcel(file, headers = {}) {
    try {
      // Convert file to base64
      const fileData = await this.fileToBase64(file);

      const response = await fetch('/api/staff/upload-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          fileData: fileData,
          fileName: file.name
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload staff excel error:', error);
      return { success: false, error: 'Failed to upload staff excel file' };
    }
  },

  // Download sample Excel template (with CSV fallback)
  async downloadSampleExcel(headers = {}) {
    try {
      const response = await fetch('/api/staff/sample-excel', {
        method: 'GET',
        headers: {
          ...headers
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Determine file extension based on content type
        const contentType = response.headers.get('content-type');
        const fileName = contentType?.includes('csv') 
          ? 'staff-upload-template.csv' 
          : 'staff-upload-template.xlsx';
        
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return { success: true };
      } else {
        // Log the actual error from the server
        const errorText = await response.text();
        console.error('Server error:', errorText);
        return { success: false, error: 'Failed to download template: ' + response.status };
      }
    } catch (error) {
      console.error('Download sample excel error:', error);
      return { success: false, error: 'Failed to download sample excel: ' + error.message };
    }
  },

  // Validate Excel data before upload (updated to work without multer)
  async validateStaffExcel(file, headers = {}) {
    try {
      // Convert file to base64
      const fileData = await this.fileToBase64(file);

      const response = await fetch('/api/staff/validate-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          fileData: fileData,
          fileName: file.name
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Validate staff excel error:', error);
      return { success: false, error: 'Failed to validate staff excel file' };
    }
  },

  // Helper method to convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove data:application/... prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
};