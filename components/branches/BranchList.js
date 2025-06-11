"use client";
import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Crown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '@/components/common/Button';
import BranchViewModal from './BranchViewModal';
import BranchEditModal from './BranchEditModal';
import BranchDeleteModal from './BranchDeleteModal';

export default function BranchList({ branches, onUpdate, pagination, onPageChange, viewMode = 'grid', onViewBranchStaff }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleView = (branch) => {
    setSelectedBranch(branch);
    setShowViewModal(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setSelectedBranch(null);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
  };

  const handleSuccess = () => {
    handleModalClose();
    onUpdate?.(pagination.page); // Refresh current page
  };

  const formatOperatingHours = (openTime, closeTime) => {
    if (!openTime || !closeTime) return 'Not set';
    return `${openTime} - ${closeTime}`;
  };

  const formatWorkingDays = (workingDays) => {
    if (!workingDays) return 'Not set';
    const days = workingDays.split(',').map(day => day.trim());
    if (days.length === 7) return 'All days';
    if (days.length === 6 && !days.includes('Sunday')) return 'Mon - Sat';
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) return 'Mon - Fri';
    return days.join(', ');
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (branches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle and Stats */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} branches
        </div>
      </div>

      {/* Branch Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => (
            <div key={branch.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{branch.code}</span>
                      {branch.is_head_office && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {branch.is_active ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              {/* Location */}
              {(branch.city || branch.state) && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{branch.city}{branch.state && `, ${branch.state}`}</span>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {branch.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{branch.phone}</span>
                  </div>
                )}
                {branch.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{branch.email}</span>
                  </div>
                )}
              </div>

              {/* Operating Hours */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{formatOperatingHours(branch.opening_time, branch.closing_time)}</span>
              </div>

              {/* Working Days */}
              <div className="mb-4">
                <span className="text-xs text-gray-500">Working Days:</span>
                <p className="text-sm text-gray-700">{formatWorkingDays(branch.working_days)}</p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {branch.is_head_office && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      Head Office
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    branch.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {branch.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleView(branch)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewBranchStaff?.(branch)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Staff"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(branch)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Branch"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(branch)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operating Hours
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
                {branches.map(branch => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {branch.name}
                            {branch.is_head_office && (
                              <Crown className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{branch.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{branch.city}</div>
                      <div className="text-sm text-gray-500">{branch.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{branch.phone}</div>
                      <div className="text-sm text-gray-500">{branch.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatOperatingHours(branch.opening_time, branch.closing_time)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatWorkingDays(branch.working_days)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {branch.is_head_office && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            Head Office
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          branch.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {branch.is_active ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {branch.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(branch)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onViewBranchStaff?.(branch)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="View Staff"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(branch)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="Edit Branch"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(branch)}
                          className="text-red-600 hover:text-red-700 p-1 rounded"
                          title="Delete Branch"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && selectedBranch && (
        <BranchEditModal
          branch={selectedBranch}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}

      {showViewModal && selectedBranch && (
        <BranchViewModal
          branch={selectedBranch}
          onClose={handleModalClose}
          onEdit={handleEdit}
        />
      )}

      {showDeleteModal && selectedBranch && (
        <BranchDeleteModal
          branch={selectedBranch}
          onClose={handleModalClose}
          onConfirm={handleSuccess}
        />
      )}
    </div>
  );
}