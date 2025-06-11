"use client";
import { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Search, 
  User,
  Phone, 
  Mail, 
  Calendar,
  Briefcase,
  Shield,
  Building2,
  Crown,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import StaffService from '@/app/services/staffService';
import StaffDetailsModal from './StaffDetailsModal';

export default function StaffListModal({ isOpen, onClose, branch, companyId }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    isActive: 'all'
  });

  const fetchStaff = async (page = 1) => {
    if (!branch?.id) {
      console.log('Missing branch ID:', { branchId: branch?.id });
      setError('Branch ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching staff for branch:', {
        branchId: branch.id,
        branchName: branch.name,
        companyId: companyId || 'not provided (optional)',
        page,
        filters
      });

      // Call service with or without company ID
      const serviceParams = {
        branchId: branch.id,
        page,
        limit: 10,
        ...filters
      };

      // Only add company ID if provided
      if (companyId) {
        serviceParams.companyId = companyId;
      }

      const response = await StaffService.getStaffByBranch(serviceParams);

      console.log('📋 Staff fetch response:', response);

      if (response.success) {
        setStaff(response.staff || []);
        setPagination(response.pagination || {});
        
        console.log('✅ Staff set successfully:', {
          staffCount: response.staff?.length || 0,
          totalItems: response.pagination?.totalItems || 0,
          pagination: response.pagination
        });

        // Show debug info if available
        if (response.debug) {
          console.log('🐛 Debug info:', response.debug);
        }
      } else {
        const errorMsg = response.error || 'Failed to fetch staff';
        console.error('❌ Staff fetch failed:', errorMsg);
        setError(errorMsg);
        
        // Show additional debug info if available
        if (response.debug) {
          console.error('🐛 Error debug info:', response.debug);
          setError(`${errorMsg}\n\nDebug Info:\n${JSON.stringify(response.debug, null, 2)}`);
        }
      }
    } catch (err) {
      console.error('💥 Error fetching staff:', err);
      let errorMessage = err.message || 'Failed to load staff';
      
      // Try to parse additional error details
      if (err.message.includes('Database query failed')) {
        errorMessage = `Database Error: ${err.message}\n\nPossible causes:\n• Table permissions\n• Invalid column names\n• Database connection issues\n• Schema mismatch`;
      } else if (err.message.includes('Column name error')) {
        errorMessage = `Schema Error: ${err.message}\n\nPlease check if all database columns match the schema.`;
      }
      
      setError(errorMessage);
      setStaff([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 StaffListModal effect triggered:', {
      isOpen,
      branchId: branch?.id,
      branchName: branch?.name,
      companyId: companyId || 'not provided (optional)',
      filtersChanged: JSON.stringify(filters)
    });

    if (isOpen && branch?.id) {
      fetchStaff(1);
    } else {
      // Reset state when modal closes or params are missing
      setStaff([]);
      setError(null);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false
      });
    }
  }, [isOpen, branch?.id, companyId, filters]);

  const handleFilterChange = (key, value) => {
    console.log('🔧 Filter changed:', { key, value });
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    console.log('📄 Page changed to:', newPage);
    fetchStaff(newPage);
  };

  const handleViewStaff = (staffMember) => {
    console.log('👤 Viewing staff member:', staffMember);
    setSelectedStaff(staffMember);
    setShowStaffDetails(true);
  };

  const getRoleInfo = (role) => {
    const roles = {
      'super_admin': { label: 'OWNER', color: 'purple', icon: Crown },
      'admin': { label: 'Admin', color: 'blue', icon: Shield },
      'branch_manager': { label: 'Branch Manager', color: 'green', icon: Briefcase },
      'branch_staff': { label: 'Branch Staff', color: 'yellow', icon: User },
      'viewer': { label: 'Viewer', color: 'gray', icon: User }
    };
    return roles[role] || { label: role, color: 'gray', icon: User };
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-600 text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Staff Members</h2>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium backdrop-blur-sm">
                      {branch?.name || 'Unknown Branch'}
                    </span>
                    {branch?.is_head_office && (
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-100 text-sm rounded-full font-medium backdrop-blur-sm">
                        Head Office
                      </span>
                    )}
                    <span className="px-3 py-1 bg-green-400/20 text-green-100 text-sm rounded-full font-medium backdrop-blur-sm">
                      {pagination.totalItems || 0} Staff
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Debug Info (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-3 text-xs font-mono">
              <strong>🐛 Debug Info:</strong><br/>
              Branch: {branch?.id} ({branch?.name})<br/>
              Company: {companyId || 'Not provided (optional)'}<br/>
              Staff Count: {staff.length}<br/>
              Total Items: {pagination.totalItems}<br/>
              Loading: {loading ? 'Yes' : 'No'}<br/>
              Error: {error ? 'Yes' : 'No'}
              {error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 max-h-32 overflow-y-auto text-xs">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">OWNER</option>
                  <option value="admin">Admin</option>
                  <option value="branch_manager">Branch Manager</option>
                  <option value="branch_staff">Branch Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading staff...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Staff</h3>
                <div className="text-red-600 mb-4 text-sm whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                  {error}
                </div>
                <button 
                  onClick={() => fetchStaff(1)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
                </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Found</h3>
                <p className="text-gray-600">
                  {Object.values(filters).some(f => f && f !== 'all') 
                    ? 'No staff members match your current filters.' 
                    : 'No staff members assigned to this branch yet.'}
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left font-mono">
                    <strong>Expected staff member:</strong><br/>
                    RAMSWAROOP PATEL (r@r.com)<br/>
                    Branch ID: 9a37f6c0-c1c3-4fce-bd1c-d54dc8915c34<br/>
                    Company ID: e4d263a3-c486-45e1-abae-0db9bf841094
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map((staffMember) => (
                  <StaffCard 
                    key={staffMember.id} 
                    staff={staffMember} 
                    onViewDetails={handleViewStaff}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalItems)} of {pagination.totalItems} staff
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Details Modal */}
      <StaffDetailsModal 
        isOpen={showStaffDetails}
        onClose={() => {
          setShowStaffDetails(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
      />
    </>
  );
}

function StaffCard({ staff, onViewDetails }) {
  const getRoleInfo = (role) => {
    const roles = {
      'super_admin': { label: 'Super Admin', color: 'purple', icon: Crown },
      'admin': { label: 'Admin', color: 'blue', icon: Shield },
      'branch_manager': { label: 'Branch Manager', color: 'green', icon: Briefcase },
      'branch_staff': { label: 'Branch Staff', color: 'yellow', icon: User },
      'viewer': { label: 'Viewer', color: 'gray', icon: User }
    };
    return roles[role] || { label: role, color: 'gray', icon: User };
  };

  const roleInfo = getRoleInfo(staff.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {staff.profile_picture_url ? (
              <img 
                src={staff.profile_picture_url} 
                alt={`${staff.first_name} ${staff.last_name}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span>
                {staff.first_name?.charAt(0) || '?'}
                {staff.last_name?.charAt(0) || ''}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {staff.first_name || 'Unknown'} {staff.last_name || ''}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                roleInfo.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                roleInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                roleInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                roleInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              } flex items-center space-x-1`}>
                <RoleIcon className="w-3 h-3" />
                <span>{roleInfo.label}</span>
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                staff.is_active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {staff.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onViewDetails(staff)}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        {/* Branch Information */}
        {staff.branch_name && (
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{staff.branch_name}</span>
              {staff.branch_code && (
                <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {staff.branch_code}
                </span>
              )}
              {staff.branch_is_head_office && (
                <Crown className="w-3 h-3 text-yellow-500" />
              )}
            </div>
          </div>
        )}
        
        {staff.designation && (
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{staff.designation}</span>
          </div>
        )}
        {staff.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{staff.email}</span>
          </div>
        )}
        {staff.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{staff.phone}</span>
            {staff.phone_verified && (
              <CheckCircle className="w-3 h-3 text-green-500" />
            )}
          </div>
        )}
        {staff.joining_date && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Joined: {new Date(staff.joining_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}