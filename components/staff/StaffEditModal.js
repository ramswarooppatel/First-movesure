"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StaffService } from '@/services/staffService';
import InputField from '@/components/common/InputField';
import CalendarComponent from '@/components/common/CalendarComponent';
import AddressComponent from '@/components/common/AddressComponent';
import Button from '@/components/common/Button';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  MapPin, 
  Shield, 
  Save, 
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function StaffEditModal({ staff, branches, onClose, onSuccess }) {
  const { getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (staff) {
      setFormData({
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        middle_name: staff.middle_name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        username: staff.username || '',
        designation: staff.designation || '',
        department: staff.department || '',
        role: staff.role || 'branch_staff',
        branch_id: staff.branch_id || '',
        date_of_birth: staff.date_of_birth || '',
        gender: staff.gender || '',
        address: staff.address || '',
        city: staff.city || '',
        state: staff.state || '',
        pincode: staff.pincode || '',
        country: staff.country || 'India',
        aadhar_number: staff.aadhar_number || '',
        pan_number: staff.pan_number || '',
        salary: staff.salary || '',
        joining_date: staff.joining_date || '',
        reporting_manager_id: staff.reporting_manager_id || '',
        emergency_contact_name: staff.emergency_contact_name || '',
        emergency_contact_phone: staff.emergency_contact_phone || '',
        is_active: staff.is_active !== false
      });
    }
  }, [staff]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address || '',
      city: addressData.city || '',
      state: addressData.state || '',
      pincode: addressData.pincode || '',
      country: addressData.country || 'India'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await StaffService.updateStaff(staff.id, formData, getAuthHeaders());

      if (result.success) {
        setSuccess('Staff member updated successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to update staff member');
      }
    } catch (error) {
      console.error('Update staff error:', error);
      setError('Failed to update staff member');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'branch_manager', label: 'Branch Manager' },
    { value: 'branch_staff', label: 'Branch Staff' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Staff Member</h2>
            <p className="text-gray-600 mt-1">Update staff member information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Success/Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">{success}</span>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="First Name *"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(value) => handleInputChange('first_name', value)}
                  required
                />
                <InputField
                  label="Middle Name"
                  placeholder="Enter middle name"
                  value={formData.middle_name}
                  onChange={(value) => handleInputChange('middle_name', value)}
                />
                <InputField
                  label="Last Name *"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(value) => handleInputChange('last_name', value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <CalendarComponent
                  label="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={(value) => handleInputChange('date_of_birth', value)}
                  placeholder="Select birth date"
                  disableFutureDates={true}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Username"
                  placeholder="unique_username"
                  value={formData.username}
                  onChange={(value) => handleInputChange('username', value.toLowerCase())}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Phone Number *"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  required
                />
                <InputField
                  label="Email Address *"
                  type="email"
                  placeholder="staff@company.com"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  required
                />
                <InputField
                  label="Emergency Contact Name"
                  placeholder="Full name"
                  value={formData.emergency_contact_name}
                  onChange={(value) => handleInputChange('emergency_contact_name', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputField
                  label="Emergency Contact Phone"
                  placeholder="+91 9876543210"
                  value={formData.emergency_contact_phone}
                  onChange={(value) => handleInputChange('emergency_contact_phone', value)}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Designation"
                  placeholder="Software Engineer"
                  value={formData.designation}
                  onChange={(value) => handleInputChange('designation', value)}
                />
                <InputField
                  label="Department"
                  placeholder="Engineering"
                  value={formData.department}
                  onChange={(value) => handleInputChange('department', value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Assignment
                  </label>
                  <select
                    value={formData.branch_id}
                    onChange={(e) => handleInputChange('branch_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} {branch.is_head_office && '(Head Office)'}
                      </option>
                    ))}
                  </select>
                </div>

                <CalendarComponent
                  label="Joining Date"
                  value={formData.joining_date}
                  onChange={(value) => handleInputChange('joining_date', value)}
                  placeholder="Select joining date"
                  maxDate={new Date().toISOString().slice(0, 10)}
                />

                <InputField
                  label="Salary"
                  type="number"
                  placeholder="50000"
                  value={formData.salary}
                  onChange={(value) => handleInputChange('salary', value)}
                />
              </div>
            </div>

            {/* Identity Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Identity Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Aadhaar Number"
                  placeholder="1234 5678 9012"
                  value={formData.aadhar_number}
                  onChange={(value) => handleInputChange('aadhar_number', value)}
                />
                <InputField
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  value={formData.pan_number}
                  onChange={(value) => handleInputChange('pan_number', value.toUpperCase())}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h3>
              <AddressComponent
                data={{
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  country: formData.country
                }}
                value={{
                  fullAddress: formData.address,
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  country: formData.country
                }}
                onChange={handleAddressChange}
                title=""
                backgroundColor="bg-gray-50"
                borderColor="border-gray-200"
                showTitle={false}
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Active Staff Member</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {loading ? 'Updating...' : 'Update Staff'}
          </Button>
        </div>
      </div>
    </div>
  );
}