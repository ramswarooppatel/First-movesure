"use client";
import { useState, useEffect } from 'react';
import { StaffService } from '@/services/staffService';
import StaffList from './StaffList';
import StaffFilters from './StaffFilters';
import StaffStats from './StaffStats';
import AddStaffModal from './AddStaffModal';
import StaffExcelUploadModal from './StaffExcelUploadModal';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  RefreshCw,
  Loader,
  FileSpreadsheet
} from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';

export default function StaffManagement() {
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    branch: '',
    role: '',
    status: 'all',
    department: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelUploadModal, setShowExcelUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Changed from 10 to 12
    total: 0
  });
  const [staffStats, setStaffStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    managers: 0
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to access staff management');
      return;
    }
    
    loadStaffData();
  }, [pagination.page, pagination.limit, searchTerm, filters, isAuthenticated]);

  // Load staff data on component mount
  const loadStaffData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from AuthContext instead of localStorage directly
      const authHeaders = getAuthHeaders();
      
      if (!authHeaders.Authorization) {
        throw new Error('No authentication token found');
      }

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      console.log('Loading staff with params:', params);
      console.log('Auth headers:', authHeaders);

      const result = await StaffService.getStaff(params, authHeaders);

      console.log('Staff result:', result);

      if (result.success) {
        setStaff(result.data || []);
        setPagination(prev => ({
          ...prev,
          total: result.total || 0,
          page: result.page || 1,
          limit: result.limit || 12
        }));
        
        // Update stats if provided
        if (result.stats) {
          setStaffStats(result.stats);
        }
      } else {
        setError(result.error || 'Failed to load staff data');
        setStaff([]);
      }
    } catch (error) {
      console.error('Load staff error:', error);
      setError(error.message || 'Failed to load staff data');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const result = await StaffService.getBranches(getAuthHeaders());
      if (result.success) {
        setBranches(result.data || []); // Ensure it's always an array
      } else {
        console.error('Failed to load branches:', result.error);
        setBranches([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Load branches error:', error);
      setBranches([]); // Set empty array on error
    }
  };

  // Load branches on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadBranches();
      loadStaffData();
    }
  }, [isAuthenticated]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStaffUpdate = async () => {
    await loadStaffData();
  };

  const handleExportStaff = async () => {
    try {
      const result = await StaffService.exportStaff(filters, getAuthHeaders());
      if (result.success) {
        // Create download link
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staff-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-600" />
                Staff Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your team members, roles, and permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="w-4 h-4" />}
                className="hidden md:flex"
              >
                Filters
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExportStaff}
                icon={<Download className="w-4 h-4" />}
                className="hidden md:flex"
              >
                Export
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowExcelUploadModal(true)}
                icon={<FileSpreadsheet className="w-4 h-4" />}
                className="hidden md:flex"
              >
                Bulk Upload
              </Button>
              
              <Button
                variant="outline"
                onClick={loadStaffData}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Refresh
              </Button>
              
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Staff
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StaffStats 
          staff={staff} 
          loading={loading} 
          totalCount={pagination.total}
          aggregatedStats={staffStats}
        />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search staff by name, email, phone, or role..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
              className="md:hidden"
            >
              Filters
            </Button>

            {/* Mobile bulk upload */}
            <Button
              variant="outline"
              onClick={() => setShowExcelUploadModal(true)}
              icon={<FileSpreadsheet className="w-4 h-4" />}
              className="md:hidden"
            >
              Bulk Upload
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <StaffFilters
                filters={filters}
                branches={branches}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Staff List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Loading staff data...</span>
            </div>
          </div>
        ) : (
          <StaffList
            staff={staff}
            branches={branches}
            onUpdate={handleStaffUpdate}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        )}

        {/* Add Staff Modal */}
        {showAddModal && (
          <AddStaffModal
            branches={branches}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleStaffUpdate}
          />
        )}

        {/* Excel Upload Modal */}
        {showExcelUploadModal && (
          <StaffExcelUploadModal
            branches={branches}
            onClose={() => setShowExcelUploadModal(false)}
            onSuccess={handleStaffUpdate}
          />
        )}
      </div>
    </div>
  );
}