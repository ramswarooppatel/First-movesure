"use client";
import { useState } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

export default function OwnerDetails({ data, updateData, onLoadingChange }) {
  const [owner, setOwner] = useState(data.owner || {});
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(data.owner?.phoneVerified || false);
  const [otp, setOtp] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const sendOTP = async () => {
    if (!owner.phone) return;
    
    onLoadingChange(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      onLoadingChange(false);
    }, 1500);
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return;
    
    onLoadingChange(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setPhoneVerified(true);
      handleChange('phoneVerified', true);
      onLoadingChange(false);
    }, 1000);
  };

  const generateUsername = () => {
    if (owner.firstName && owner.lastName) {
      const username = (owner.firstName + owner.lastName).toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      handleChange('username', username);
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">👤</span>
          </span>
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
          <InputField
            label="Date of Birth"
            type="date"
            value={owner.dateOfBirth || ''}
            onChange={(value) => handleChange('dateOfBirth', value)}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={owner.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">📞</span>
          </span>
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={owner.email || ''}
            onChange={(value) => handleChange('email', value)}
            required
          />

          {/* Mobile Verification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              {phoneVerified && (
                <div className="flex items-center text-green-600">
                  <span className="text-sm font-medium mr-2">Verified</span>
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <InputField
                    placeholder="+91 9876543210"
                    value={owner.phone || ''}
                    onChange={(value) => handleChange('phone', value)}
                    disabled={phoneVerified}
                  />
                </div>
                {!otpSent && !phoneVerified && (
                  <Button
                    variant="primary"
                    onClick={sendOTP}
                    disabled={!owner.phone}
                    className="px-6"
                  >
                    Send OTP
                  </Button>
                )}
              </div>
              
              {otpSent && !phoneVerified && (
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <InputField
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={verifyOTP}
                    disabled={otp.length !== 6}
                    className="px-6"
                  >
                    Verify
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Identity Documents */}
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">🆔</span>
          </span>
          Identity Documents (Optional)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Aadhaar Number"
            placeholder="1234 5678 9012"
            value={owner.aadharNumber || ''}
            onChange={(value) => handleChange('aadharNumber', value)}
            maxLength={12}
          />
          
          <InputField
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={owner.panNumber || ''}
            onChange={(value) => handleChange('panNumber', value.toUpperCase())}
            maxLength={10}
          />
        </div>
      </div>

      {/* Account Credentials */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">🔐</span>
          </span>
          Account Credentials
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <Button
                variant="outline"
                onClick={generateUsername}
                className="text-xs px-3 py-1"
                disabled={!owner.firstName || !owner.lastName}
              >
                Generate
              </Button>
            </div>
            <InputField
              placeholder="Choose a unique username"
              value={owner.username || ''}
              onChange={(value) => handleChange('username', value.toLowerCase())}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <InputField
              type="password"
              placeholder="Create a strong password"
              value={owner.password || ''}
              onChange={(value) => handleChange('password', value)}
            />
            
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
                <p className="text-xs text-gray-600 mt-1">
                  Use 8+ characters with mix of letters, numbers & symbols
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">💼</span>
          </span>
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
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">🚨</span>
          </span>
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