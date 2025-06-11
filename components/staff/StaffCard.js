"use client";
import { 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Edit,
  Eye,
  Crown,
  Shield,
  UserCheck,
  UserX,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';

export default function StaffCard({ staff, branch, onEdit, onView, onUpdate }) {
  const [showActions, setShowActions] = useState(false);

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
      super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      admin: { label: 'Admin', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      branch_manager: { label: 'Manager', color: 'bg-green-100 text-green-800 border-green-200' },
      branch_staff: { label: 'Staff', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      viewer: { label: 'Viewer', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };

    const config = roleConfig[role] || roleConfig.branch_staff;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {(staff.first_name?.[0] || '').toUpperCase()}
              {(staff.last_name?.[0] || '').toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {staff.first_name} {staff.last_name}
            </h3>
            <p className="text-sm text-gray-600">@{staff.username}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onView();
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEdit();
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Staff
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role and Status */}
      <div className="flex items-center justify-between mb-4">
        {getRoleBadge(staff.role)}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          staff.is_active 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {staff.is_active ? (
            <UserCheck className="w-3 h-3 mr-1" />
          ) : (
            <UserX className="w-3 h-3 mr-1" />
          )}
          {staff.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{staff.phone}</span>
          {staff.phone_verified && (
            <UserCheck className="w-3 h-3 ml-1 text-green-500" />
          )}
        </div>
        {staff.address && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{staff.city}, {staff.state}</span>
          </div>
        )}
      </div>

      {/* Branch and Department */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{branch}</span>
        </div>
        {staff.department && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{staff.department}</span>
          </div>
        )}
      </div>

      {/* Joining Date */}
      {staff.joining_date && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>Joined {formatDate(staff.joining_date)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={onView}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        <button
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
      </div>
    </div>
  );
}