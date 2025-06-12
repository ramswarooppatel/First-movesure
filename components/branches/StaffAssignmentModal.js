"use client";
import { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Plus, 
  Loader, 
  CheckCircle,
  User,
  Mail,
  Phone,
  Shield,
  Crown,
  Eye,
  UserCheck,
  Building2,
  ArrowRight,
  AlertTriangle,
  Filter
} from 'lucide-react';
import Button from '@/components/common/Button';
import { StaffAssignmentService } from '@/services/staffAssignmentService';
import { useAuth } from '@/context/AuthContext';

export default function StaffAssignmentModal({ branch, onClose, onSuccess }) {
  const { getAuthHeaders } = useAuth();
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [includeAssigned, setIncludeAssigned] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Transfer confirmation
  const [transferConfirmation, setTransferConfirmation] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, [searchTerm, roleFilter, includeAssigned]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await StaffAssignmentService.getStaffForAssignment(
        { 
          search: searchTerm, 
          role: roleFilter,
          include_assigned: includeAssigned.toString(),
          current_branch: branch.id // Exclude staff already in this branch
        },
        getAuthHeaders()
      );
      
      if (result.success) {
        setStaff(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelection = (staffMember) => {
    const staffId = staffMember.id;
    
    // If staff is already assigned to another branch, show transfer confirmation
    if (staffMember.branch_id && !selectedStaff.includes(staffId)) {
      setTransferConfirmation({
        staff: staffMember,
        fromBranch: staffMember.branches?.name || 'Unknown Branch',
        toBranch: branch.name
      });
      return;
    }

    setSelectedStaff(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  const confirmTransfer = () => {
    if (transferConfirmation) {
      setSelectedStaff(prev => [...prev, transferConfirmation.staff.id]);
      setTransferConfirmation(null);
    }
  };

  const cancelTransfer = () => {
    setTransferConfirmation(null);
  };

  const handleSelectAll = () => {
    if (selectedStaff.length === staff.length) {
      setSelectedStaff([]);
    } else {
      // Check if any staff need transfer confirmation
      const staffNeedingConfirmation = staff.filter(s => s.branch_id && !selectedStaff.includes(s.id));
      if (staffNeedingConfirmation.length > 0) {
        // Show bulk transfer confirmation
        setTransferConfirmation({
          bulk: true,
          count: staffNeedingConfirmation.length,
          toBranch: branch.name
        });
      } else {
        setSelectedStaff(staff.map(s => s.id));
      }
    }
  };

  const confirmBulkTransfer = () => {
    setSelectedStaff(staff.map(s => s.id));
    setTransferConfirmation(null);
  };

  const handleAssignStaff = async () => {
    if (selectedStaff.length === 0) {
      setError('Please select at least one staff member to assign');
      return;
    }

    try {
      setAssigning(true);
      setError(null);
      
      const result = await StaffAssignmentService.assignStaffToBranch(
        branch.id,
        selectedStaff,
        getAuthHeaders()
      );
      
      if (result.success) {
        setSuccess(result.message);
        setSelectedStaff([]);
        await fetchStaff(); // Refresh the list
        
        // Close modal after successful assignment
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error assigning staff:', error);
      setError('Failed to assign staff to branch');
    } finally {
      setAssigning(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'branch_manager':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'branch_staff':
        return <Users className="w-4 h-4 text-gray-600" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-yellow-600" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      branch_manager: 'Branch Manager',
      branch_staff: 'Staff',
      viewer: 'Viewer'
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      branch_manager: 'bg-green-100 text-green-800',
      branch_staff: 'bg-gray-100 text-gray-800',
      viewer: 'bg-yellow-100 text-yellow-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  const getAssignmentStatusColor = (staffMember) => {
    if (!staffMember.branch_id) {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  const getAssignmentStatusLabel = (staffMember) => {
    if (!staffMember.branch_id) {
      return 'Unassigned';
    }
    return staffMember.branches?.name || 'Assigned';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Assign Staff to Branch</h3>
                  <p className="text-blue-100">
                    Add or transfer staff members to <span className="font-medium">{branch.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff by name, email, or designation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeAssigned"
                    checked={includeAssigned}
                    onChange={(e) => setIncludeAssigned(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeAssigned" className="text-sm font-medium text-gray-700">
                    Include already assigned staff (for transfers)
                  </label>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Extended Filters */}
              {showFilters && (
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="branch_manager">Branch Manager</option>
                      <option value="branch_staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Stats and Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {staff.length} staff member{staff.length !== 1 ? 's' : ''} found
                  {selectedStaff.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {selectedStaff.length} selected
                    </span>
                  )}
                </div>
                {staff.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedStaff.length === staff.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading staff...</span>
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Found</h3>
                <p className="text-gray-600">
                  {includeAssigned
                    ? 'No staff members match your search criteria'
                    : 'No unassigned staff found. Enable "Include already assigned staff" to show staff from other branches for transfers.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {staff.map((staffMember) => (
                  <div
                    key={staffMember.id}
                    onClick={() => handleStaffSelection(staffMember)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedStaff.includes(staffMember.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {(staffMember.first_name?.[0] || '').toUpperCase()}
                              {(staffMember.last_name?.[0] || '').toUpperCase()}
                            </span>
                          </div>
                          {selectedStaff.includes(staffMember.id) && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {staffMember.first_name} {staffMember.last_name}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staffMember.role)}`}>
                              <span className="flex items-center space-x-1">
                                {getRoleIcon(staffMember.role)}
                                <span>{getRoleLabel(staffMember.role)}</span>
                              </span>
                            </span>
                          </div>
                          {staffMember.designation && (
                            <p className="text-sm text-gray-600 mt-1">{staffMember.designation}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{staffMember.email}</span>
                            </div>
                            {staffMember.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{staffMember.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(staffMember)}`}>
                          {getAssignmentStatusLabel(staffMember)}
                        </span>
                        {staffMember.branch_id && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Building2 className="w-3 h-3" />
                            <span>{staffMember.branches?.city || 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedStaff.length > 0 && (
                  <span>
                    {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected for assignment
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={assigning}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAssignStaff}
                  disabled={selectedStaff.length === 0 || assigning}
                  icon={assigning ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                >
                  {assigning ? 'Assigning...' : `Assign ${selectedStaff.length || ''} Staff`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Confirmation Modal */}
      {transferConfirmation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {transferConfirmation.bulk ? 'Confirm Bulk Transfer' : 'Confirm Staff Transfer'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {transferConfirmation.bulk 
                      ? `Transfer ${transferConfirmation.count} staff members?`
                      : 'This staff member is currently assigned to another branch'
                    }
                  </p>
                </div>
              </div>

              {!transferConfirmation.bulk && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{transferConfirmation.fromBranch}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-700">{transferConfirmation.toBranch}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Staff: {transferConfirmation.staff?.first_name} {transferConfirmation.staff?.last_name}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-6">
                {transferConfirmation.bulk
                  ? 'Some selected staff members are currently assigned to other branches. Proceeding will transfer them to this branch.'
                  : 'Proceeding will transfer this staff member from their current branch to this branch. This action can be reversed later if needed.'
                }
              </p>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelTransfer}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={transferConfirmation.bulk ? confirmBulkTransfer : confirmTransfer}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  Confirm Transfer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}