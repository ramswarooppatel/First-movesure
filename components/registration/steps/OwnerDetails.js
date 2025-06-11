"use client";
import { useState, useRef } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import AddressComponent from '@/components/common/AddressComponent';
import PANComponent from '@/components/common/PANComponent';
import AadhaarComponent from '@/components/common/AadhaarComponent';
import PhoneVerificationComponent from '@/components/common/PhoneVerificationComponent';
import EmailVerificationComponent from '@/components/common/EmailVerificationComponent';
import PhotoUpload from '@/components/common/PhotoUpload';
import UsernameField from '@/components/common/UsernameField';
import { 
  User, 
  Phone, 
  CreditCard, 
  Lock, 
  Briefcase, 
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
  Mail,
  Calendar,
  Users,
  Shield,
  MapPin,
  X
} from 'lucide-react';

export default function OwnerDetails({ data, updateData, onLoadingChange }) {
  const [owner, setOwner] = useState(data.owner || {});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);

  const handleChange = (field, value) => {
    const updatedOwner = { ...owner, [field]: value };
    
    // Check password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  const calculatePasswordStrength = (password) => {
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
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-600' };
      case 2: return { text: 'Weak', color: 'text-orange-600' };
      case 3: return { text: 'Fair', color: 'text-yellow-600' };
      case 4: return { text: 'Good', color: 'text-blue-600' };
      case 5: return { text: 'Strong', color: 'text-green-600' };
      default: return { text: '', color: '' };
    }
  };

  const generateUsername = () => {
    if (owner.firstName && owner.lastName) {
      const username = (owner.firstName + owner.lastName).toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      handleChange('username', username);
    }
  };

  // Handle photo change from PhotoUpload component
  const handlePhotoChange = (photoData) => {
    if (photoData) {
      // Store the complete photo data
      handleChange('photo', photoData.photo);
      handleChange('photoFileName', photoData.fileName);
      handleChange('photoFileSize', photoData.fileSize);
      handleChange('photoUploadedAt', photoData.uploadedAt);
    } else {
      // Remove photo
      handleChange('photo', '');
      handleChange('photoFileName', '');
      handleChange('photoFileSize', '');
      handleChange('photoUploadedAt', '');
    }
  };

  // Address component handler
  const handleAddressChange = (addressData) => {
    const updatedOwner = { ...owner, ...addressData };
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  // PAN component handlers
  const handlePANChange = (panNumber) => {
    const updatedOwner = { ...owner, panNumber };
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  const handlePANVerificationSuccess = (panData) => {
    const updatedOwner = { ...owner };
    if (panData.holderName && !owner.holderName) {
      updatedOwner.holderName = panData.holderName;
      const nameParts = panData.holderName.split(' ');
      if (nameParts.length >= 2 && !owner.firstName) {
        updatedOwner.firstName = nameParts[0];
        updatedOwner.lastName = nameParts[nameParts.length - 1];
        if (nameParts.length > 2) {
          updatedOwner.middleName = nameParts.slice(1, -1).join(' ');
        }
      }
    }
    updatedOwner.panVerified = true;
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  // Aadhaar component handlers
  const handleAadhaarChange = (aadhaarNumber) => {
    const updatedOwner = { ...owner, aadhaarNumber };
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  const handleAadhaarVerificationSuccess = (aadhaarData) => {
    const updatedOwner = { ...owner, aadhaarVerified: true };
    if (aadhaarData.holderName && !owner.holderName) {
      updatedOwner.holderName = aadhaarData.holderName;
    }
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  // Phone verification handlers
  const handlePhoneVerificationSuccess = (phoneData) => {
    const updatedOwner = { ...owner, phoneVerified: true };
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  // Email verification handlers
  const handleEmailVerificationSuccess = (emailData) => {
    const updatedOwner = { ...owner, emailVerified: true };
    setOwner(updatedOwner);
    updateData('owner', updatedOwner);
  };

  return (
    <div className="space-y-8">
      {/* Photo Upload Component */}
      <PhotoUpload
        value={owner.photo || ''} // Pass the base64 photo directly
        onChange={handlePhotoChange}
        onLoadingChange={onLoadingChange}
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
            label="First Name"
            placeholder="Enter first name"
            value={owner.firstName || ''}
            onChange={(value) => handleChange('firstName', value)}
            required
          />
          
          <InputField
            label="Middle Name (Optional)"
            placeholder="Enter middle name"
            value={owner.middleName || ''}
            onChange={(value) => handleChange('middleName', value)}
          />
          
          <InputField
            label="Last Name"
            placeholder="Enter last name"
            value={owner.lastName || ''}
            onChange={(value) => handleChange('lastName', value)}
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
              value={owner.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Gender
            </label>
            <select
              value={owner.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        {/* Email Verification */}
        <EmailVerificationComponent
          value={owner.email || ''}
          onChange={(value) => handleChange('email', value)}
          onVerificationSuccess={handleEmailVerificationSuccess}
          title="Email Verification"
          backgroundColor="bg-indigo-50"
          borderColor="border-indigo-200"
          iconColor="bg-indigo-500"
          titleColor="text-indigo-900"
          required={true}
          checkAvailability={true}
        />

        {/* Phone Verification */}
        <PhoneVerificationComponent
          value={owner.phone || ''}
          onChange={(value) => handleChange('phone', value)}
          onVerificationSuccess={handlePhoneVerificationSuccess}
          title="Mobile Verification"
          backgroundColor="bg-green-50"
          borderColor="border-green-200"
          iconColor="bg-green-500"
          titleColor="text-green-900"
          required={true}
        />
      </div>

      {/* Address Information */}
      <AddressComponent
        data={{
          address: owner.address,
          city: owner.city,
          state: owner.state,
          pincode: owner.pincode,
          country: owner.country
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
            value={owner.panNumber || ''}
            onChange={handlePANChange}
            onVerificationSuccess={handlePANVerificationSuccess}
            title="PAN Verification"
            backgroundColor="bg-yellow-50"
            borderColor="border-yellow-200"
            iconColor="bg-yellow-600"
            titleColor="text-yellow-900"
            required={false}
            placeholder="ABCDE1234F"
          />

          {/* Aadhaar Component */}
          <AadhaarComponent
            value={owner.aadhaarNumber || ''}
            onChange={handleAadhaarChange}
            onVerificationSuccess={handleAadhaarVerificationSuccess}
            title="Aadhaar Verification"
            backgroundColor="bg-orange-50"
            borderColor="border-orange-200"
            iconColor="bg-orange-600"
            titleColor="text-orange-900"
            required={false}
            placeholder="1234 5678 9012"
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
            value={owner.username || ''}
            onChange={(value) => handleChange('username', value)}
            onValidationChange={setUsernameValid}
            firstName={owner.firstName}
            lastName={owner.lastName}
            required={true}
          />
          
          <div>
            <label className="block text-sm font-medium text-black mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={owner.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
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
            
            {owner.password && (
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

        {/* Validation Status */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Account Status:</div>
          <div className="space-y-1 text-xs">
            <div className={`flex items-center ${usernameValid ? 'text-green-600' : 'text-red-600'}`}>
              {usernameValid ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              Username validated
            </div>
            <div className={`flex items-center ${passwordStrength >= 3 ? 'text-green-600' : 'text-red-600'}`}>
              {passwordStrength >= 3 ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              Strong password
            </div>
          </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Designation"
            value={owner.designation || 'Super Admin'}
            onChange={(value) => handleChange('designation', value)}
            disabled
          />
          
          <InputField
            label="Department"
            value={owner.department || 'Management'}
            onChange={(value) => handleChange('department', value)}
            disabled
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          Emergency Contact (Optional)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Emergency Contact Name"
            placeholder="Full name of emergency contact"
            value={owner.emergencyContactName || ''}
            onChange={(value) => handleChange('emergencyContactName', value)}
          />
          
          <InputField
            label="Emergency Contact Phone"
            placeholder="+91 9876543210"
            value={owner.emergencyContactPhone || ''}
            onChange={(value) => handleChange('emergencyContactPhone', value)}
          />
        </div>
      </div>
    </div>
  );
}