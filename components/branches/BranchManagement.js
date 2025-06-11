"use client";
import { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Grid,
  List
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BranchService } from '@/services/branchService';

// Import existing components
import BranchList from './BranchList';
import BranchDetailsModal from './BranchDetailsModal';
import BranchAddModal from './BranchAddModal';
import BranchEditModal from './BranchEditModal';
import BranchViewModal from './BranchViewModal';
import BranchDeleteModal from './BranchDeleteModal';
import StaffDetailsModal from '../staff/StaffDetailsModal';
import StaffListModal from '../staff/StaffListModal';
import Button from '@/components/common/Button';

export default function BranchManagement() {
  const { user, companyId, getAuthHeaders } = useAuth();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Modal states
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showStaffListModal, setShowStaffListModal] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    is_head_office: 'all',
    city: '',
    state: ''
  });

  // Get the actual company ID
  const getCompanyId = useCallback(() => {
    const userCompanyId = companyId || 
                         user?.company_id || 
                         user?.companyId || 
                         user?.company?.id ||
                         user?.profile?.company_id;
    
    console.log('getCompanyId - Final company ID:', userCompanyId);
    return userCompanyId;
  }, [companyId, user]);

  // Optimized fetch function with caching
  const fetchBranches = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCompanyId = getCompanyId();
      
      console.log('fetchBranches - Company ID:', userCompanyId);
      console.log('fetchBranches - Page:', page);
      
      if (!userCompanyId) {
        throw new Error(`Company ID not available. User fields: ${user ? Object.keys(user).join(', ') : 'No user'}`);
      }
      
      const response = await BranchService.getBranches({
        page,
        limit: 12,
        companyId: userCompanyId,
        ...filters
      });

      setBranches(response.branches || []);
      setPagination(response.pagination || {});
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.message || 'Failed to load branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [getCompanyId, user, filters]);

  // Debounced search effect
  useEffect(() => {
    const userCompanyId = getCompanyId();
    
    if (userCompanyId) {
      const timeoutId = setTimeout(() => {
        fetchBranches(1);
      }, 300); // 300ms debounce
      
      return () => clearTimeout(timeoutId);
    } else if (user === null || user === undefined) {
      console.log('User data still loading...');
      setLoading(true);
    } else {
      setError(`No company associated with your account. Available user fields: ${Object.keys(user || {}).join(', ')}`);
      setLoading(false);
    }
  }, [filters, getCompanyId, user, fetchBranches]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    fetchBranches(newPage);
  };

  const handleRefresh = () => {
    fetchBranches(pagination.currentPage);
  };

  // Branch CRUD operations
  const handleAddBranch = () => {
    setShowAddModal(true);
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setShowViewModal(true);
  };

  const handleDeleteBranch = (branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const handleBranchCreated = () => {
    setShowAddModal(false);
    fetchBranches(pagination.currentPage);
  };

  const handleBranchUpdated = () => {
    setShowEditModal(false);
    setSelectedBranch(null);
    fetchBranches(pagination.currentPage);
  };

  const handleBranchDeleted = async () => {
    if (selectedBranch) {
      try {
        const result = await BranchService.deleteBranch(selectedBranch.id, getAuthHeaders());
        
        if (result.success) {
          setShowDeleteModal(false);
          setSelectedBranch(null);
          fetchBranches(pagination.currentPage);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  // Staff operations
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setShowStaffModal(true);
  };

  const handleViewBranchStaff = (branch) => {
    const userCompanyId = getCompanyId();
    console.log('handleViewBranchStaff - Branch:', branch);
    console.log('handleViewBranchStaff - Company ID:', userCompanyId);
    
    if (!userCompanyId) {
      alert('Company ID not available. Please refresh and try again.');
      return;
    }
    
    setSelectedBranch(branch);
    setShowStaffListModal(true);
  };

  // Modal close handlers
  const closeBranchModal = () => {
    setShowBranchModal(false);
    setSelectedBranch(null);
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setSelectedStaff(null);
  };

  const closeStaffListModal = () => {
    setShowStaffListModal(false);
    setSelectedBranch(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading branches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-800 font-medium mb-2">Error Loading Branches</div>
        <div className="text-red-600 text-sm mb-4">{error}</div>
        <div className="text-xs text-gray-600 mb-4">
          <strong>Debug Info:</strong><br/>
          User: {user ? 'Loaded' : 'Not loaded'}<br/>
          Company ID: {getCompanyId() || 'Not available'}<br/>
          User Keys: {user ? Object.keys(user).join(', ') : 'No user'}
        </div>
        <Button 
          onClick={() => fetchBranches(1)}
          variant="outline"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
            <p className="text-gray-600">Manage your business locations and operations</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              onClick={handleAddBranch}
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Branch
            </Button>
          </div>
        </div>

        {/* Debug Info (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
            <strong>Debug Info:</strong> Company ID: {getCompanyId() || 'Not available'} | 
            User ID: {user?.id || 'Not available'} | 
            Branches Count: {branches.length}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search branches..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.is_head_office}
                onChange={(e) => handleFilterChange('is_head_office', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="true">Head Office</option>
                <option value="false">Branch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Filter by city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Branches List using existing BranchList component */}
        <BranchList
          branches={branches}
          onUpdate={fetchBranches}
          pagination={{
            page: pagination.currentPage,
            limit: 12,
            total: pagination.totalItems
          }}
          onPageChange={handlePageChange}
          viewMode={viewMode}
          onViewBranchStaff={handleViewBranchStaff}
        />
      </div>

      {/* All Modals using existing components */}
      
      {/* Legacy Branch Details Modal */}
      <BranchDetailsModal 
        isOpen={showBranchModal}
        onClose={closeBranchModal}
        branch={selectedBranch}
      />

      {/* New CRUD Modals */}
      {showAddModal && (
        <BranchAddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleBranchCreated}
        />
      )}

      {showEditModal && selectedBranch && (
        <BranchEditModal
          branch={selectedBranch}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
          onSuccess={handleBranchUpdated}
        />
      )}

      {showViewModal && selectedBranch && (
        <BranchViewModal
          branch={selectedBranch}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBranch(null);
          }}
          onEdit={handleEditBranch}
        />
      )}

      {showDeleteModal && selectedBranch && (
        <BranchDeleteModal
          branch={selectedBranch}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBranch(null);
          }}
          onConfirm={handleBranchDeleted}
        />
      )}
      
      {/* Staff Modals */}
      <StaffDetailsModal 
        isOpen={showStaffModal}
        onClose={closeStaffModal}
        staff={selectedStaff}
      />

      <StaffListModal 
        isOpen={showStaffListModal}
        onClose={closeStaffListModal}
        branch={selectedBranch}
        companyId={getCompanyId()}
      />
    </>
  );
}

