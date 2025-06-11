"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BranchService } from '@/services/branchService';
import InputField from '@/components/common/InputField';
import AddressComponent from '@/components/common/AddressComponent';
import Button from '@/components/common/Button';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Save, 
  Loader,
  AlertCircle,
  CheckCircle,
  Crown,
  Calendar
} from 'lucide-react';

export default function BranchAddModal({ onClose, onSuccess }) {
  const { user, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    phone: '',
    email: '',
    is_head_office: false,
    is_active: true,
    opening_time: '09:00',
    closing_time: '18:00',
    working_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
  });

  const getCompanyId = () => {
    return user?.company_id || user?.companyId || user?.company?.id || user?.profile?.company_id;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address || '',
      city: addressData.city || '',
      state: addressData.state || '',
      pincode: addressData.pincode || ''
    }));
  };

  const handleWorkingDaysChange = (day) => {
    const currentDays = formData.working_days.split(',').filter(d => d.trim());
    const dayExists = currentDays.includes(day);
    
    let newDays;
    if (dayExists) {
      newDays = currentDays.filter(d => d !== day);
    } else {
      newDays = [...currentDays, day];
    }
    
    setFormData(prev => ({ ...prev, working_days: newDays.join(',') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Branch name is required');
      return;
    }

    const companyId = getCompanyId();
    if (!companyId) {
      setError('Company ID not available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const branchData = {
        ...formData,
        company_id: companyId
      };

      const result = await BranchService.createBranch(branchData, getAuthHeaders());
      
      if (result.success) {
        setSuccess('Branch created successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to create branch');
      }
    } catch (error) {
      console.error('Create error:', error);
      setError('Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Branch</h3>
              <p className="text-sm text-gray-600">Create a new branch location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="Branch Name"
                placeholder="Main Branch, Delhi Office, etc."
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                required
              />
              
              <InputField
                label="Branch Code"
                placeholder="BR001, DEL001, etc."
                value={formData.code}
                onChange={(value) => handleInputChange('code', value)}
              />
              
              <InputField
                label="Country"
                placeholder="India"
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_head_office}
                    onChange={(e) => handleInputChange('is_head_office', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <Crown className="w-4 h-4 mr-1 text-yellow-500" />
                    Head Office
                  </span>
                </label>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    Active Branch
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
              />
              
              <InputField
                label="Email Address"
                type="email"
                placeholder="branch@company.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h4>
            
            <AddressComponent
              data={{
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
              }}
              onChange={handleAddressChange}
              showCountry={false}
            />
          </div>

          {/* Operating Hours */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Operating Hours
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                <input
                  type="time"
                  value={formData.opening_time}
                  onChange={(e) => handleInputChange('opening_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                <input
                  type="time"
                  value={formData.closing_time}
                  onChange={(e) => handleInputChange('closing_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Working Days
            </h4>
            
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {weekDays.map(day => {
                const isSelected = formData.working_days.split(',').includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWorkingDaysChange(day)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}
        </form>

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
            {loading ? 'Creating...' : 'Create Branch'}
          </Button>
        </div>
      </div>
    </div>
  );
}