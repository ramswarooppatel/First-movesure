"use client";
import { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Eye
} from 'lucide-react';
import Button from '@/components/common/Button';
import { StaffService } from '@/services/staffService';
import { useAuth } from '@/context/AuthContext';

export default function StaffExcelUploadModal({ branches, onClose, onSuccess }) {
  const { getAuthHeaders } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type (now includes CSV)
      if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
        setError('Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError('');
      setValidationResults(null);
      setUploadResults(null);
    }
  };

  const handleValidate = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setValidating(true);
    setError('');

    try {
      const result = await StaffService.validateStaffExcel(file, getAuthHeaders());
      
      if (result.success) {
        setValidationResults(result.data);
        setSuccess('File validated successfully!');
      } else {
        setError(result.error || 'Validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setError('Failed to validate file');
    } finally {
      setValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await StaffService.uploadStaffExcel(file, getAuthHeaders());
      
      if (result.success) {
        setUploadResults(result.data);
        setSuccess(`Successfully uploaded! ${result.data.created} staff members created.`);
        
        // Close modal after successful upload
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const result = await StaffService.downloadSampleExcel(getAuthHeaders());
      if (!result.success) {
        setError('Failed to download sample file');
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download sample file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Upload Staff</h3>
              <p className="text-sm text-gray-600">Upload multiple staff members via Excel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Download Sample Section */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Download Sample Excel</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Download the template with all required fields and sample data
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadSample}
                icon={<Download className="w-4 h-4" />}
                className="text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                Download Template
              </Button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Excel File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  Excel files (.xlsx, .xls) or CSV files (.csv) - Max 5MB
                </p>
              </label>
            </div>
            
            {file && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setValidationResults(null);
                    setUploadResults(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Validation Section */}
          {file && !uploadResults && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleValidate}
                disabled={validating}
                icon={validating ? <Loader className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                className="w-full"
              >
                {validating ? 'Validating...' : 'Validate File'}
              </Button>
            </div>
          )}

          {/* Validation Results */}
          {validationResults && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Validation Results</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <span className="block text-lg font-bold text-green-600">
                    {validationResults.valid}
                  </span>
                  <span className="text-gray-600">Valid Records</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-red-600">
                    {validationResults.invalid}
                  </span>
                  <span className="text-gray-600">Invalid Records</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-blue-600">
                    {validationResults.total}
                  </span>
                  <span className="text-gray-600">Total Records</span>
                </div>
              </div>
              
              {validationResults.errors && validationResults.errors.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-red-900 mb-2">Validation Errors:</h5>
                  <div className="max-h-32 overflow-y-auto">
                    {validationResults.errors.map((error, index) => (
                      <div key={index} className="text-xs text-red-700 mb-1">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Results */}
          {uploadResults && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-medium text-green-900">Upload Completed</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Successfully Created:</span>
                  <span className="ml-2 font-bold">{uploadResults.created}</span>
                </div>
                <div>
                  <span className="text-red-700">Failed:</span>
                  <span className="ml-2 font-bold">{uploadResults.failed}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">Important Instructions:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Download the sample template first</li>
              <li>• Fill in all required fields: First Name, Last Name, Email, Phone, Role</li>
              <li>• Ensure email and phone numbers are unique within your company</li>
              <li>• Branch ID should match existing branch IDs in your system</li>
              <li>• Use the exact role values: super_admin, admin, branch_manager, branch_staff, viewer</li>
              <li>• Date format should be YYYY-MM-DD</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          {file && !uploadResults && (
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={loading || validating}
              icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            >
              {loading ? 'Uploading...' : 'Upload Staff'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}