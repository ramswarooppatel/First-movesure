"use client";
import { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Briefcase,
  Shield,
  Building2,
  Crown,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  Camera,
  Globe
} from 'lucide-react';

export default function StaffDetailsModal({ isOpen, onClose, staff }) {
  if (!isOpen || !staff) return null;

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

  const roleInfo = getRoleInfo(staff.role);
  const RoleIcon = roleInfo.icon;

  return (
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
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${
          roleInfo.color === 'purple' ? 'from-purple-500 via-indigo-600 to-purple-700' :
          roleInfo.color === 'blue' ? 'from-blue-500 via-indigo-600 to-blue-700' :
          roleInfo.color === 'green' ? 'from-green-500 via-emerald-600 to-green-700' :
          roleInfo.color === 'yellow' ? 'from-yellow-500 via-orange-600 to-yellow-700' :
          'from-gray-500 via-slate-600 to-gray-700'
        } text-white p-8 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
                  {staff.profile_picture_url ? (
                    <img 
                      src={staff.profile_picture_url} 
                      alt={`${staff.first_name} ${staff.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                {staff.isOwner && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-yellow-800" />
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {staff.first_name} {staff.middle_name} {staff.last_name}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 bg-white/20 text-white rounded-full font-medium backdrop-blur-sm flex items-center space-x-2`}>
                    <RoleIcon className="w-4 h-4" />
                    <span>{roleInfo.label}</span>
                  </span>
                  {staff.designation && (
                    <span className="px-3 py-1 bg-white/15 text-white text-sm rounded-full backdrop-blur-sm">
                      {staff.designation}
                    </span>
                  )}
                  <span className={`px-3 py-1 text-sm rounded-full font-medium backdrop-blur-sm ${
                    staff.is_active 
                      ? 'bg-green-400/20 text-green-100' 
                      : 'bg-red-400/20 text-red-100'
                  }`}>
                    {staff.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-white/80 mt-2">{staff.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <Edit className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <Copy className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {staff.first_name} {staff.middle_name} {staff.last_name}
                    </p>
                  </div>
                  {staff.date_of_birth && (
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(staff.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {staff.gender && (
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold text-gray-900">{staff.gender}</p>
                    </div>
                  )}
                  {staff.language_preference && (
                    <div>
                      <p className="text-sm text-gray-600">Language Preference</p>
                      <p className="font-semibold text-gray-900">{staff.language_preference}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Identity Documents */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-purple-600" />
                  Identity Documents
                </h3>
                <div className="space-y-4">
                  {staff.aadhar_number && (
                    <div>
                      <p className="text-sm text-gray-600">Aadhaar Number</p>
                      <p className="font-semibold text-gray-900">
                        ****-****-{staff.aadhar_number.slice(-4)}
                      </p>
                    </div>
                  )}
                  {staff.pan_number && (
                    <div>
                      <p className="text-sm text-gray-600">PAN Number</p>
                      <p className="font-semibold text-gray-900">{staff.pan_number}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Contact & Address */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-green-600" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{staff.phone}</p>
                        {staff.phone_verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-semibold text-gray-900">{staff.email}</p>
                    </div>
                  </div>
                  {staff.username && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Username</p>
                        <p className="font-semibold text-gray-900">@{staff.username}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-orange-600" />
                  Address Information
                </h3>
                <div className="space-y-3">
                  {staff.address && (
                    <div>
                      <p className="text-sm text-gray-600">Street Address</p>
                      <p className="font-semibold text-gray-900">{staff.address}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {staff.city && (
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-semibold text-gray-900">{staff.city}</p>
                      </div>
                    )}
                    {staff.state && (
                      <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-semibold text-gray-900">{staff.state}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {staff.pincode && (
                      <div>
                        <p className="text-sm text-gray-600">Pincode</p>
                        <p className="font-semibold text-gray-900">{staff.pincode}</p>
                      </div>
                    )}
                    {staff.country && (
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold text-gray-900">{staff.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Professional Info */}
            <div className="space-y-6">
              {/* Professional Information */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-yellow-600" />
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900">{roleInfo.label}</p>
                  </div>
                  {staff.designation && (
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-semibold text-gray-900">{staff.designation}</p>
                    </div>
                  )}
                  {staff.department && (
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-semibold text-gray-900">{staff.department}</p>
                    </div>
                  )}
                  {staff.joining_date && (
                    <div>
                      <p className="text-sm text-gray-600">Joining Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(staff.joining_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {staff.salary && (
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-semibold text-gray-900">₹{staff.salary.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Branch Assignment Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-indigo-600" />
                  Branch Assignment
                </h3>
                <div className="space-y-3">
                  {staff.branch_id || staff.branch_name ? (
                    <div className="p-4 bg-white rounded-lg border border-indigo-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            {staff.branch_name || 'Unknown Branch'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            {staff.branch_code && (
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                {staff.branch_code}
                              </span>
                            )}
                            {staff.branch_is_head_office && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center space-x-1">
                                <Crown className="w-3 h-3" />
                                <span>Head Office</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Branch Location */}
                      {(staff.branch_city || staff.branch_state) && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>
                            {staff.branch_city}
                            {staff.branch_city && staff.branch_state && ', '}
                            {staff.branch_state}
                          </span>
                        </div>
                      )}
                      
                      {/* Branch ID (for development/debugging) */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                          <strong>Debug:</strong> Branch ID: {staff.branch_id}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">No branch assigned</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              {(staff.emergency_contact_name || staff.emergency_contact_phone) && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    {staff.emergency_contact_name && (
                      <div>
                        <p className="text-sm text-gray-600">Contact Name</p>
                        <p className="font-semibold text-gray-900">{staff.emergency_contact_name}</p>
                      </div>
                    )}
                    {staff.emergency_contact_phone && (
                      <div>
                        <p className="text-sm text-gray-600">Contact Phone</p>
                        <p className="font-semibold text-gray-900">{staff.emergency_contact_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">
                Member since: {staff.joining_date ? new Date(staff.joining_date).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Edit Staff
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Remove Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}