"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StaffService } from '@/services/staffService';
import InputField from '@/components/common/InputField';
import CalendarComponent from '@/components/common/CalendarComponent';
import AddressComponent from '@/components/common/AddressComponent';
import PANComponent from '@/components/common/PANComponent';
import AadhaarComponent from '@/components/common/AadhaarComponent';
import PhoneVerificationComponent from '@/components/common/PhoneVerificationComponent';
import EmailVerificationComponent from '@/components/common/EmailVerificationComponent';
import PhotoUpload from '@/components/common/PhotoUpload';
import UsernameField from '@/components/common/UsernameField';
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
  CheckCircle,
  CreditCard,
  Lock,
  Users,
  Calendar,
  Building2,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function StaffEditModal({ staff, branches = [], onClose, onSuccess }) {
  const { getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameValid, setUsernameValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
        is_active: staff.is_active !== false,
        profile_picture_url: staff.profile_picture_url || '',
        phone_verified: staff.phone_verified || false,
        email_verified: staff.email_verified || false,
        pan_verified: staff.pan_verified || false,
        aadhar_verified: staff.aadhar_verified || false,
        password: '' // Empty for security
      });
      setUsernameValid(true); // Assume existing username is valid
    }
  }, [staff]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');

    // Check password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return { text: '', color: '' };
      case 1: return { text: 'Very Weak', color: 'text-red-600' };
      case 2: return { text: 'Weak', color: 'text-orange-600' };
      case 3: return { text: 'Fair', color: 'text-yellow-600' };
      case 4: return { text: 'Good', color: 'text-blue-600' };
      case 5: return { text: 'Strong', color: 'text-green-600' };
      default: return { text: '', color: '' };
    }
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

  // Photo upload handler
  const handlePhotoChange = (photoData) => {
    if (photoData) {
      handleInputChange('profile_picture_url', photoData.photo);
      handleInputChange('photo_file_name', photoData.fileName);
      handleInputChange('photo_file_size', photoData.fileSize);
      handleInputChange('photo_uploaded_at', photoData.uploadedAt);
    } else {
      handleInputChange('profile_picture_url', '');
      handleInputChange('photo_file_name', '');
      handleInputChange('photo_file_size', '');
      handleInputChange('photo_uploaded_at', '');
    }
  };

  // PAN verification handlers
  const handlePANChange = (panNumber) => {
    handleInputChange('pan_number', panNumber);
  };

  const handlePANVerificationSuccess = (panData) => {
    handleInputChange('pan_verified', true);
    if (panData.holderName && !formData.first_name) {
      const nameParts = panData.holderName.split(' ');
      if (nameParts.length >= 2) {
        handleInputChange('first_name', nameParts[0]);
        handleInputChange('last_name', nameParts[nameParts.length - 1]);
        if (nameParts.length > 2) {
          handleInputChange('middle_name', nameParts.slice(1, -1).join(' '));
        }
      }
    }
  };

  // Aadhaar verification handlers
  const handleAadhaarChange = (aadhaarNumber) => {
    handleInputChange('aadhar_number', aadhaarNumber);
  };

  const handleAadhaarVerificationSuccess = (aadhaarData) => {
    handleInputChange('aadhar_verified', true);
  };

  // Phone verification handlers
  const handlePhoneVerificationSuccess = (phoneData) => {
    handleInputChange('phone_verified', true);
  };

  // Email verification handlers
  const handleEmailVerificationSuccess = (emailData) => {
    handleInputChange('email_verified', true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    if (!usernameValid) {
      setError('Please choose a valid username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Remove empty password field if not changed
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      // Remove photo metadata fields if they exist
      delete submitData.photo_file_name;
      delete submitData.photo_file_size;
      delete submitData.photo_uploaded_at;

      const result = await StaffService.updateStaff(staff.id, submitData, getAuthHeaders());

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

  // Ensure branches is an array
  const availableBranches = Array.isArray(branches) ? branches : [];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
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
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
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

            {/* Photo Upload */}
            <PhotoUpload
              value={formData.profile_picture_url || ''}
              onChange={handlePhotoChange}
              label="Profile Photo"
              placeholder="Add Photo"
              maxSize={10}
              outputSize={400}
              previewSize={128}
              required={false}
              backgroundColor="bg-gradient-to-r from-purple-50 to-pink-50"
              borderColor="border-purple-200"
              iconColor="bg-purple-500"
              buttonColor="bg-purple-600 hover:bg-purple-700"
              showCropModal={true}
              autoGenerateFilename={true}
            />

            {/* Personal Information */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                Personal Information
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Email Verification */}
              <EmailVerificationComponent
                value={formData.email || ''}
                onChange={(value) => handleInputChange('email', value)}
                onVerificationSuccess={handleEmailVerificationSuccess}
                title="Email Verification"
                backgroundColor="bg-indigo-50"
                borderColor="border-indigo-200"
                iconColor="bg-indigo-500"
                titleColor="text-indigo-900"
                required={true}
                checkAvailability={false} // Don't check availability for existing staff
                isVerified={formData.email_verified}
              />

              {/* Phone Verification */}
              <PhoneVerificationComponent
                value={formData.phone || ''}
                onChange={(value) => handleInputChange('phone', value)}
                onVerificationSuccess={handlePhoneVerificationSuccess}
                title="Mobile Verification"
                backgroundColor="bg-green-50"
                borderColor="border-green-200"
                iconColor="bg-green-500"
                titleColor="text-green-900"
                required={true}
                isVerified={formData.phone_verified}
              />
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                Emergency Contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Emergency Contact Name"
                  placeholder="Full name of emergency contact"
                  value={formData.emergency_contact_name}
                  onChange={(value) => handleInputChange('emergency_contact_name', value)}
                />
                <InputField
                  label="Emergency Contact Phone"
                  placeholder="+91 9876543210"
                  value={formData.emergency_contact_phone}
                  onChange={(value) => handleInputChange('emergency_contact_phone', value)}
                />
              </div>
            </div>

            {/* Address Information */}
            <AddressComponent
              data={{
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country
              }}
              onChange={handleAddressChange}
              title="Address Information"
              backgroundColor="bg-orange-50"
              borderColor="border-orange-200"
              iconColor="bg-orange-500"
              titleColor="text-orange-900"
              prefix="Personal"
              showCountry={false}
            />

            {/* Identity Documents */}
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                Identity Documents
              </h3>
              
              <div className="space-y-6">
                {/* PAN Component */}
                <PANComponent
                  value={formData.pan_number || ''}
                  onChange={handlePANChange}
                  onVerificationSuccess={handlePANVerificationSuccess}
                  title="PAN Verification"
                  backgroundColor="bg-yellow-50"
                  borderColor="border-yellow-200"
                  iconColor="bg-yellow-600"
                  titleColor="text-yellow-900"
                  required={false}
                  placeholder="ABCDE1234F"
                  isVerified={formData.pan_verified}
                />

                {/* Aadhaar Component */}
                <AadhaarComponent
                  value={formData.aadhar_number || ''}
                  onChange={handleAadhaarChange}
                  onVerificationSuccess={handleAadhaarVerificationSuccess}
                  title="Aadhaar Verification"
                  backgroundColor="bg-orange-50"
                  borderColor="border-orange-200"
                  iconColor="bg-orange-600"
                  titleColor="text-orange-900"
                  required={false}
                  placeholder="1234 5678 9012"
                  isVerified={formData.aadhar_verified}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
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
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    Branch Assignment
                  </label>
                  <select
                    value={formData.branch_id}
                    onChange={(e) => handleInputChange('branch_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Branch</option>
                    {availableBranches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} {branch.is_head_office && '(Head Office)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => handleInputChange('joining_date', e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <InputField
                  label="Salary"
                  type="number"
                  placeholder="50000"
                  value={formData.salary}
                  onChange={(value) => handleInputChange('salary', value)}
                />
              </div>
            </div>

            {/* Account Credentials */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                Account Credentials
              </h3>
              
              <div className="space-y-6">
                {/* Username Field with Validation */}
                <UsernameField
                  value={formData.username || ''}
                  onChange={(value) => handleInputChange('username', value)}
                  onValidationChange={setUsernameValid}
                  firstName={formData.first_name}
                  lastName={formData.last_name}
                  required={true}
                  excludeUserId={staff.id} // Exclude current user from username check
                />
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    New Password (Leave blank to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (optional)"
                      value={formData.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength <= 1 ? 'bg-red-500' :
                              passwordStrength <= 2 ? 'bg-orange-500' :
                              passwordStrength <= 3 ? 'bg-yellow-500' :
                              passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getPasswordStrengthText().color}`}>
                          {getPasswordStrengthText().text}
                        </span>
                      </div>
                      <p className="text-xs text-black mt-1">
                        Use 8+ characters with mix of letters, numbers & symbols
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="flex items-center space-x-3 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-medium text-gray-900">Active Staff Member</span>
              </label>
              <p className="text-xs text-gray-600 mt-1 ml-7">
                Inactive staff members cannot log in to the system
              </p>
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
            disabled={loading || !usernameValid}
            icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {loading ? 'Updating...' : 'Update Staff'}
          </Button>
        </div>
      </div>
    </div>
  );
}