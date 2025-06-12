"use client";
import { useState } from 'react';
import { 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Edit,
  Trash2,
  Eye,
  Users,
  Crown,
  Shield,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import StaffCard from './StaffCard';
import StaffEditModal from './StaffEditModal';
import StaffViewModal from './StaffViewModal';
import Button from '@/components/common/Button';

export default function StaffList({ staff, branches, onUpdate, pagination, onPageChange }) {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // Add this line - missing state

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'branch_manager':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      super_admin: { label: 'OWNER', color: 'bg-purple-100 text-purple-800' },
      admin: { label: 'Admin', color: 'bg-blue-100 text-blue-800' },
      branch_manager: { label: 'Manager', color: 'bg-green-100 text-green-800' },
      branch_staff: { label: 'Staff', color: 'bg-gray-100 text-gray-800' },
      viewer: { label: 'Viewer', color: 'bg-yellow-100 text-yellow-800' }
    };

    const config = roleConfig[role] || roleConfig.branch_staff;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? `${branch.name}${branch.is_head_office ? ' (HO)' : ''}` : 'N/A';
  };

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowEditModal(true);
  };

  const handleViewStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowViewModal(true);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Add debugging to see what pagination data we're receiving
  console.log('Pagination data:', pagination);
  console.log('Total pages calculated:', totalPages);
  console.log('Staff count:', staff.length);

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'table' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Table View
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} staff
        </div>
      </div>

      {/* Staff Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {staff.map(member => (
            <StaffCard
              key={member.id}
              staff={member}
              branch={getBranchName(member.branch_id)}
              onEdit={() => handleEditStaff(member)}
              onView={() => handleViewStaff(member)}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(member.first_name?.[0] || '').toUpperCase()}
                            {(member.last_name?.[0] || '').toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{member.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="mb-2">{getRoleBadge(member.role)}</div>
                      <div className="text-sm text-gray-500">
                        {getBranchName(member.branch_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.is_active ? (
                          <UserCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <UserX className="w-3 h-3 mr-1" />
                        )}
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewStaff(member)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditStaff(member)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="Edit Staff"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Pagination - Always show if there's data */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              Next
            </Button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results ({pagination.limit} per page)
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 10) {
                    pageNum = i + 1;
                  } else {
                    // Smart pagination for many pages
                    if (pagination.page <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page >= totalPages - 4) {
                      pageNum = totalPages - 9 + i;
                    } else {
                      pageNum = pagination.page - 4 + i;
                    }
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  const isActive = pageNum === pagination.page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        isActive
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Debug info - remove after testing */}
      <div className="p-4 text-xs text-gray-500 border-t">
        Debug: Total: {pagination.total}, Page: {pagination.page}, Limit: {pagination.limit}, Total Pages: {totalPages}
      </div>

      {/* Modals */}
      {showEditModal && (
        <StaffEditModal 
          staff={selectedStaff}
          branches={branches || []} // Ensure branches is always an array
          onClose={() => setShowEditModal(false)} 
          onSuccess={onUpdate}
        />
      )}
      {showViewModal && (
        <StaffViewModal 
          isOpen={showViewModal} 
          onClose={() => setShowViewModal(false)} 
          staff={selectedStaff}
          branches={branches || []} // Ensure branches is always an array
        />
      )}
    </div>
  );
}