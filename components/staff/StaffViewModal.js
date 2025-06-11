"use client";
import { useState, useEffect } from 'react';
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
  Globe,
  UserCheck,
  UserX,
  Clock,
  CreditCard,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function StaffViewModal({ isOpen, onClose, staff, branches = [], onEdit, onDelete }) {
  const [copySuccess, setCopySuccess] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  if (!isOpen || !staff) return null;

  const getRoleInfo = (role) => {
    const roles = {
      'super_admin': { label: 'OWNER', color: 'purple', icon: Crown, bgColor: 'bg-purple-500' },
      'admin': { label: 'Admin', color: 'blue', icon: Shield, bgColor: 'bg-blue-500' },
      'branch_manager': { label: 'Branch Manager', color: 'green', icon: Briefcase, bgColor: 'bg-green-500' },
      'branch_staff': { label: 'Branch Staff', color: 'yellow', icon: User, bgColor: 'bg-yellow-500' },
      'viewer': { label: 'Viewer', color: 'gray', icon: User, bgColor: 'bg-gray-500' }
    };
    return roles[role] || { label: role, color: 'gray', icon: User, bgColor: 'bg-gray-500' };
  };

  // Enhanced branch information retrieval
  const getBranchInfo = () => {
    // First, try to find branch from the branches array using branch_id
    if (staff.branch_id && branches.length > 0) {
      const branch = branches.find(b => b.id === staff.branch_id);
      if (branch) {
        return {
          id: branch.id,
          name: branch.name,
          code: branch.code,
          city: branch.city,
          state: branch.state,
          is_head_office: branch.is_head_office,
          address: branch.address,
          phone: branch.phone,
          email: branch.email
        };
      }
    }

    // Fallback to staff object properties (if joined data exists)
    if (staff.branch_name || staff.branches?.name) {
      return {
        id: staff.branch_id,
        name: staff.branch_name || staff.branches?.name,
        code: staff.branch_code || staff.branches?.code,
        city: staff.branch_city || staff.branches?.city,
        state: staff.branch_state || staff.branches?.state,
        is_head_office: staff.branch_is_head_office || staff.branches?.is_head_office,
        address: staff.branch_address || staff.branches?.address,
        phone: staff.branch_phone || staff.branches?.phone,
        email: staff.branch_email || staff.branches?.email
      };
    }

    return null;
  };

  const branchInfo = getBranchInfo();
  const roleInfo = getRoleInfo(staff.role);
  const RoleIcon = roleInfo.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(`${label} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const InfoRow = ({ icon: Icon, label, value, copyable = false, sensitive = false }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-900">
          {sensitive && !showSensitiveData 
            ? '••••••••' 
            : (value || 'Not provided')
          }
        </span>
        {copyable && value && (showSensitiveData || !sensitive) && (
          <button
            onClick={() => copyToClipboard(value, label)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title={`Copy ${label}`}
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Copy Success Notification */}
        {copySuccess && (
          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
            {copySuccess}
          </div>
        )}

        {/* Header with Gradient Background */}
        <div className={`${roleInfo.bgColor} text-white p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Picture or Initials */}
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm">
                {staff.profile_picture_url ? (
                  <img 
                    src={staff.profile_picture_url} 
                    alt={`${staff.first_name} ${staff.last_name}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span>
                    {(staff.first_name?.[0] || '').toUpperCase()}
                    {(staff.last_name?.[0] || '').toUpperCase()}
                  </span>
                )}
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {staff.first_name} {staff.middle_name} {staff.last_name}
                </h2>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="px-4 py-2 bg-white/20 text-white rounded-full font-medium backdrop-blur-sm flex items-center space-x-2">
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
                <p className="text-white/80 text-lg">{staff.email}</p>
                {staff.username && (
                  <p className="text-white/70">@{staff.username}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sensitive Data Toggle */}
              <button 
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
                title={showSensitiveData ? 'Hide sensitive data' : 'Show sensitive data'}
              >
                {showSensitiveData ? (
                  <EyeOff className="w-5 h-5 text-white" />
                ) : (
                  <Eye className="w-5 h-5 text-white" />
                )}
              </button>
              
              {onEdit && (
                <button 
                  onClick={onEdit}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  title="Edit Staff"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
              )}
              
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
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
              {/* Personal Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-1">
                  <InfoRow 
                    icon={User} 
                    label="Full Name" 
                    value={`${staff.first_name} ${staff.middle_name || ''} ${staff.last_name}`.trim()} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Date of Birth" 
                    value={formatDate(staff.date_of_birth)} 
                  />
                  <InfoRow 
                    icon={User} 
                    label="Gender" 
                    value={staff.gender} 
                  />
                  <InfoRow 
                    icon={User} 
                    label="Username" 
                    value={staff.username}
                    copyable 
                  />
                </div>
              </div>

              {/* Identity Documents */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-purple-600" />
                  Identity Documents
                </h3>
                <div className="space-y-1">
                  <InfoRow 
                    icon={Shield} 
                    label="Aadhaar Number" 
                    value={staff.aadhar_number}
                    sensitive={true}
                    copyable 
                  />
                  <InfoRow 
                    icon={Shield} 
                    label="PAN Number" 
                    value={staff.pan_number}
                    sensitive={true}
                    copyable 
                  />
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
                <div className="space-y-1">
                  <InfoRow 
                    icon={Phone} 
                    label="Phone Number" 
                    value={staff.phone}
                    copyable 
                  />
                  <InfoRow 
                    icon={Mail} 
                    label="Email Address" 
                    value={staff.email}
                    copyable 
                  />
                  <InfoRow 
                    icon={CheckCircle} 
                    label="Phone Verified" 
                    value={staff.phone_verified ? 'Yes' : 'No'} 
                  />
                  <InfoRow 
                    icon={CheckCircle} 
                    label="Email Verified" 
                    value={staff.email_verified ? 'Yes' : 'No'} 
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-orange-600" />
                  Address Information
                </h3>
                <div className="space-y-1">
                  <InfoRow 
                    icon={MapPin} 
                    label="Street Address" 
                    value={staff.address} 
                  />
                  <InfoRow 
                    icon={MapPin} 
                    label="City" 
                    value={staff.city} 
                  />
                  <InfoRow 
                    icon={MapPin} 
                    label="State" 
                    value={staff.state} 
                  />
                  <InfoRow 
                    icon={MapPin} 
                    label="Pincode" 
                    value={staff.pincode} 
                  />
                  <InfoRow 
                    icon={Globe} 
                    label="Country" 
                    value={staff.country} 
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              {(staff.emergency_contact_name || staff.emergency_contact_phone) && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-1">
                    <InfoRow 
                      icon={User} 
                      label="Contact Name" 
                      value={staff.emergency_contact_name} 
                    />
                    <InfoRow 
                      icon={Phone} 
                      label="Contact Phone" 
                      value={staff.emergency_contact_phone}
                      copyable 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Professional Information */}
            <div className="space-y-6">
              {/* Professional Details */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-yellow-600" />
                  Professional Information
                </h3>
                <div className="space-y-1">
                  <InfoRow 
                    icon={Shield} 
                    label="Role" 
                    value={roleInfo.label} 
                  />
                  <InfoRow 
                    icon={Briefcase} 
                    label="Designation" 
                    value={staff.designation} 
                  />
                  <InfoRow 
                    icon={Building2} 
                    label="Department" 
                    value={staff.department} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Joining Date" 
                    value={formatDate(staff.joining_date)} 
                  />
                  {staff.salary && (
                    <InfoRow 
                      icon={CreditCard} 
                      label="Salary" 
                      value={`₹${parseInt(staff.salary).toLocaleString()}`}
                      sensitive={true}
                    />
                  )}
                </div>
              </div>

              {/* Enhanced Branch Assignment */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-indigo-600" />
                  Branch Assignment
                </h3>
                {branchInfo ? (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">
                          {branchInfo.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {branchInfo.code && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                              {branchInfo.code}
                            </span>
                          )}
                          {branchInfo.is_head_office && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center space-x-1">
                              <Crown className="w-3 h-3" />
                              <span>Head Office</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Branch Location */}
                    {(branchInfo.city || branchInfo.state) && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>
                          {branchInfo.city}
                          {branchInfo.city && branchInfo.state && ', '}
                          {branchInfo.state}
                        </span>
                      </div>
                    )}

                    {/* Branch Contact */}
                    <div className="space-y-1 text-sm">
                      {branchInfo.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{branchInfo.phone}</span>
                        </div>
                      )}
                      {branchInfo.email && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{branchInfo.email}</span>
                        </div>
                      )}
                      {branchInfo.address && (
                        <div className="flex items-start space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-xs">{branchInfo.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">No branch assigned</span>
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-gray-600" />
                  Account Information
                </h3>
                <div className="space-y-1">
                  <InfoRow 
                    icon={Calendar} 
                    label="Created" 
                    value={formatDateTime(staff.created_at)} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Last Updated" 
                    value={formatDateTime(staff.updated_at)} 
                  />
                  <InfoRow 
                    icon={Clock} 
                    label="Last Login" 
                    value={formatDateTime(staff.last_login)} 
                  />
                  <InfoRow 
                    icon={UserCheck} 
                    label="Status" 
                    value={staff.is_active ? 'Active' : 'Inactive'} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">
              Member since: {formatDate(staff.joining_date || staff.created_at)}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            
            {onEdit && (
              <Button
                variant="primary"
                onClick={onEdit}
                icon={<Edit className="w-4 h-4" />}
              >
                Edit Staff
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="danger"
                onClick={onDelete}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Remove Staff
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}