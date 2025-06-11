"use client";
import { useState, useEffect } from 'react';
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
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BranchService from '@/app/services/branchService';
import BranchDetailsModal from './BranchDetailsModal';
import StaffDetailsModal from '../staff/StaffDetailsModal';
import StaffListModal from '../staff/StaffListModal';

export default function BranchManagement() {
  const { user, companyId } = useAuth();
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
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showStaffListModal, setShowStaffListModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    is_head_office: 'all',
    city: '',
    state: ''
  });

  // Get the actual company ID
  const getCompanyId = () => {
    const userCompanyId = companyId || 
                         user?.company_id || 
                         user?.companyId || 
                         user?.company?.id ||
                         user?.profile?.company_id;
    
    console.log('getCompanyId - Final company ID:', userCompanyId);
    return userCompanyId;
  };

  const fetchBranches = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCompanyId = getCompanyId();
      
      console.log('fetchBranches - Company ID:', userCompanyId);
      console.log('fetchBranches - User object:', user);
      
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
  };

  useEffect(() => {
    const userCompanyId = getCompanyId();
    
    console.log('Effect - Company ID:', userCompanyId);
    console.log('Effect - User:', user);
    
    if (userCompanyId) {
      fetchBranches(1);
    } else if (user === null || user === undefined) {
      console.log('User data still loading...');
      setLoading(true);
    } else {
      setError(`No company associated with your account. Available user fields: ${Object.keys(user || {}).join(', ')}`);
      setLoading(false);
    }
  }, [filters, companyId, user?.company_id, user?.companyId, user]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    fetchBranches(newPage);
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setShowBranchModal(true);
  };

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
        <button 
          onClick={() => fetchBranches(1)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
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
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                placeholder="Filter by state"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        {branches.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-600 mb-6">
              {Object.values(filters).some(f => f && f !== 'all') 
                ? 'No branches match your current filters.' 
                : 'Get started by adding your first branch.'}
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Branch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard 
                key={branch.id} 
                branch={branch} 
                onViewBranch={handleViewBranch}
                onViewStaff={handleViewStaff}
                onViewBranchStaff={handleViewBranchStaff}
                companyId={getCompanyId()}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * 12) + 1} to {Math.min(pagination.currentPage * 12, pagination.totalItems)} of {pagination.totalItems} branches
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BranchDetailsModal 
        isOpen={showBranchModal}
        onClose={closeBranchModal}
        branch={selectedBranch}
      />
      
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

function BranchCard({ branch, onViewBranch, onViewStaff, onViewBranchStaff, companyId }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{branch.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{branch.code}</span>
              {branch.is_head_office && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Head Office
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onViewBranch(branch)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Branch Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onViewBranchStaff(branch)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="View Branch Staff"
          >
            <Users className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {branch.address && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <span className="text-gray-600">{branch.address}, {branch.city}, {branch.state}</span>
          </div>
        )}
        {branch.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{branch.phone}</span>
          </div>
        )}
        {branch.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{branch.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className={`px-2 py-1 rounded-full ${
            branch.is_active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {branch.is_active ? 'Active' : 'Inactive'}
          </span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{branch.opening_time} - {branch.closing_time}</span>
          </div>
        </div>
      </div>

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
          Branch ID: {branch.id}<br/>
          Company ID: {companyId || 'Missing!'}
        </div>
      )}
    </div>
  );
}

