"use client";
import { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  MapPin, 
  Shield, 
  Calendar,
  Building2,
  Crown,
  UserCheck,
  UserX,
  Edit,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function StaffViewModal({ staff, branches, onClose, onEdit }) {
  const [copySuccess, setCopySuccess] = useState('');

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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? `${branch.name}${branch.is_head_office ? ' (Head Office)' : ''}` : 'Not Assigned';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(`${label} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const InfoRow = ({ icon: Icon, label, value, copyable = false }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-900">{value || 'Not provided'}</span>
        {copyable && value && (
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300">
        {/* Copy Success Notification */}
        {copySuccess && (
          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-lg text-sm shadow-lg">
            {copySuccess}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {(staff.first_name?.[0] || '').toUpperCase()}
                {(staff.last_name?.[0] || '').toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {staff.first_name} {staff.last_name}
              </h2>
              <p className="text-gray-600">@{staff.username}</p>
              <div className="mt-2">{getRoleBadge(staff.role)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
              staff.is_active 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {staff.is_active ? (
                <UserCheck className="w-3 h-3 mr-1" />
              ) : (
                <UserX className="w-3 h-3 mr-1" />
              )}
              {staff.is_active ? 'Active' : 'Inactive'}
            </span>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
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

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
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
                    icon={User} 
                    label="Emergency Contact" 
                    value={staff.emergency_contact_name} 
                  />
                  <InfoRow 
                    icon={Phone} 
                    label="Emergency Phone" 
                    value={staff.emergency_contact_phone}
                    copyable 
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Identity Documents
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <InfoRow 
                    icon={Shield} 
                    label="Aadhaar Number" 
                    value={staff.aadhar_number ? `****-****-${staff.aadhar_number.slice(-4)}` : 'Not provided'} 
                  />
                  <InfoRow 
                    icon={Shield} 
                    label="PAN Number" 
                    value={staff.pan_number}
                    copyable 
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
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
                    icon={Building2} 
                    label="Branch" 
                    value={getBranchName(staff.branch_id)} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Joining Date" 
                    value={formatDate(staff.joining_date)} 
                  />
                  {staff.salary && (
                    <InfoRow 
                      icon={User} 
                      label="Salary" 
                      value={`₹${parseInt(staff.salary).toLocaleString()}`} 
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <InfoRow 
                    icon={MapPin} 
                    label="Address" 
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
                    icon={MapPin} 
                    label="Country" 
                    value={staff.country} 
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Account Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <InfoRow 
                    icon={Calendar} 
                    label="Created" 
                    value={formatDate(staff.created_at)} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Last Updated" 
                    value={formatDate(staff.updated_at)} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Last Login" 
                    value={formatDate(staff.last_login)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
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
        </div>
      </div>
    </div>
  );
}