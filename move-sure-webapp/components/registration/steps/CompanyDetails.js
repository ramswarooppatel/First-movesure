"use client";
import { useState } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

export default function CompanyDetails({ data, updateData, onLoadingChange }) {
  const [company, setCompany] = useState(data.company || {});
  const [gstVerifying, setGstVerifying] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  const [panVerified, setPanVerified] = useState(false);

  const handleChange = (field, value) => {
    const updatedCompany = { ...company, [field]: value };
    setCompany(updatedCompany);
    updateData('company', updatedCompany);
  };

  const verifyGST = async () => {
    if (!company.gstNumber) return;
    
    setGstVerifying(true);
    onLoadingChange(true);
    
    // Simulate GST verification API call
    setTimeout(() => {
      setGstVerified(true);
      setGstVerifying(false);
      onLoadingChange(false);
      
      // Auto-fill company details from GST data
      handleChange('name', company.name || 'Verified Company Name Pvt Ltd');
      handleChange('panNumber', company.panNumber || 'ABCDE1234F');
      handleChange('city', company.city || 'Mumbai');
      handleChange('state', company.state || 'Maharashtra');
      handleChange('address', company.address || 'Sample Business Address, Commercial Complex');
    }, 2000);
  };

  const verifyPAN = async () => {
    if (!company.panNumber) return;
    
    setPanVerifying(true);
    onLoadingChange(true);
    
    // Simulate PAN verification API call
    setTimeout(() => {
      setPanVerified(true);
      setPanVerifying(false);
      onLoadingChange(false);
    }, 1500);
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
    'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 
    'Lakshadweep', 'Andaman and Nicobar Islands'
  ];

  return (
    <div className="space-y-8">
      {/* Basic Company Information */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">🏢</span>
          </span>
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Company Name"
            placeholder="Enter your company name"
            value={company.name || ''}
            onChange={(value) => handleChange('name', value)}
            required
          />
          
          <InputField
            label="Registration Number"
            placeholder="Company registration number"
            value={company.registrationNumber || ''}
            onChange={(value) => handleChange('registrationNumber', value)}
            required
          />
          
          <InputField
            label="Company Email"
            type="email"
            placeholder="company@example.com"
            value={company.email || ''}
            onChange={(value) => handleChange('email', value)}
          />
          
          <InputField
            label="Company Phone"
            placeholder="+91 9876543210"
            value={company.phone || ''}
            onChange={(value) => handleChange('phone', value)}
          />
          
          <div className="md:col-span-2">
            <InputField
              label="Website (Optional)"
              placeholder="https://www.yourcompany.com"
              value={company.website || ''}
              onChange={(value) => handleChange('website', value)}
            />
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">📋</span>
          </span>
          Tax Information
        </h3>

        {/* GST Verification */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              GST Number (Optional)
            </label>
            {gstVerified && (
              <div className="flex items-center text-green-600">
                <span className="text-sm font-medium mr-2">Verified</span>
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <InputField
                placeholder="22AAAAA0000A1Z5"
                value={company.gstNumber || ''}
                onChange={(value) => handleChange('gstNumber', value.toUpperCase())}
                maxLength={15}
              />
            </div>
            <Button
              variant="primary"
              onClick={verifyGST}
              disabled={!company.gstNumber || gstVerifying || gstVerified}
              className="px-6"
            >
              {gstVerifying ? 'Verifying...' : gstVerified ? 'Verified' : 'Verify GST'}
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Verification helps auto-fill company details and enables tax features
          </p>
        </div>

        {/* PAN Verification */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              PAN Number
            </label>
            {panVerified && (
              <div className="flex items-center text-green-600">
                <span className="text-sm font-medium mr-2">Verified</span>
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <InputField
                placeholder="ABCDE1234F"
                value={company.panNumber || ''}
                onChange={(value) => handleChange('panNumber', value.toUpperCase())}
                maxLength={10}
              />
            </div>
            <Button
              variant="primary"
              onClick={verifyPAN}
              disabled={!company.panNumber || panVerifying || panVerified}
              className="px-6"
            >
              {panVerifying ? 'Verifying...' : panVerified ? 'Verified' : 'Verify PAN'}
            </Button>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">📍</span>
          </span>
          Address Information
        </h3>
        
        <div className="space-y-4">
          <InputField
            label="Business Address"
            placeholder="Enter complete business address"
            value={company.address || ''}
            onChange={(value) => handleChange('address', value)}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="City"
              placeholder="Enter city"
              value={company.city || ''}
              onChange={(value) => handleChange('city', value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={company.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <InputField
              label="PIN Code"
              placeholder="400001"
              value={company.pincode || ''}
              onChange={(value) => handleChange('pincode', value)}
              maxLength={6}
            />
          </div>
          
          <InputField
            label="Country"
            value={company.country || 'India'}
            onChange={(value) => handleChange('country', value)}
            disabled
          />
        </div>
      </div>

      {/* Company Description */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">📝</span>
          </span>
          Company Description (Optional)
        </h3>
        
        <textarea
          placeholder="Brief description of your business, products, or services..."
          value={company.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-h-[100px]"
          maxLength={500}
        />
        <p className="text-xs text-gray-600 mt-2">
          {(company.description || '').length}/500 characters
        </p>
      </div>
    </div>
  );
}