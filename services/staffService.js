export class StaffService {
  static async getStaff(params = {}, headers = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await fetch(`/api/staff?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get staff error:', error);
      return { success: false, error: 'Failed to fetch staff data' };
    }
  }

  static async getBranches(headers = {}) {
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
  }

  static async createStaff(staffData, headers = {}) {
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
  }

  static async updateStaff(staffId, staffData, headers = {}) {
    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(staffData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update staff error:', error);
      return { success: false, error: 'Failed to update staff member' };
    }
  }

  static async deleteStaff(staffId, headers = {}) {
    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delete staff error:', error);
      return { success: false, error: 'Failed to delete staff member' };
    }
  }

  static async exportStaff(filters = {}, headers = {}) {
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
  }

  // Excel upload functionality (updated to work without multer)
  static async uploadStaffExcel(file, headers = {}) {
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
  }

  // Download sample Excel template (with CSV fallback)
  static async downloadSampleExcel(headers = {}) {
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
  }

  // Validate Excel data before upload (updated to work without multer)
  static async validateStaffExcel(file, headers = {}) {
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
  }

  // Helper method to convert file to base64
  static fileToBase64(file) {
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
}