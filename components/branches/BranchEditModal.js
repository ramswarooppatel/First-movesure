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
  Calendar,
  Edit,
  Globe,
  Settings,
  Star,
  Shield,
  Zap,
  Activity,
  Target,
  RotateCcw
} from 'lucide-react';

export default function BranchEditModal({ branch, onClose, onSuccess }) {
  const { getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: branch.name || '',
    code: branch.code || '',
    address: branch.address || '',
    city: branch.city || '',
    state: branch.state || '',
    country: branch.country || 'India',
    pincode: branch.pincode || '',
    phone: branch.phone || '',
    email: branch.email || '',
    is_head_office: branch.is_head_office || false,
    is_active: branch.is_active !== false,
    opening_time: branch.opening_time || '09:00',
    closing_time: branch.closing_time || '18:00',
    working_days: branch.working_days || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
  });

  const [originalData] = useState({ ...formData });

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

  const handleDiscard = () => {
    setFormData({ ...originalData });
    setError('');
    setSuccess('');
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Branch name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await BranchService.updateBranch(branch.id, formData, getAuthHeaders());
      
      if (result.success) {
        setSuccess('Branch updated successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to update branch');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update branch');
    } finally {
      setLoading(false);
    }
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getStatusColor = () => {
    if (formData.is_head_office) {
      return 'from-yellow-500 via-orange-500 to-amber-600';
    }
    return formData.is_active 
      ? 'from-blue-500 via-indigo-600 to-purple-600' 
      : 'from-gray-500 via-slate-600 to-gray-700';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      {/* Enhanced Background Overlay with Animated Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/10 rounded-full animate-pulse"></div>
      </div>

      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full h-[95vh] overflow-hidden border border-white/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spectacular Header with Gradient and Glassmorphism */}
        <div className={`relative bg-gradient-to-r ${getStatusColor()} text-white overflow-hidden flex-shrink-0`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-spin-slow"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
            
            {/* Flowing lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="animate-dash" />
              <path d="M0,60 Q25,80 50,60 T100,70" stroke="currentColor" strokeWidth="0.3" fill="none" className="animate-dash" style={{animationDelay: '1s'}} />
            </svg>
          </div>

          <div className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Enhanced Icon Container */}
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Edit className="w-8 h-8 text-white" />
                  </div>
                  {formData.is_head_office && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-3 h-3 text-yellow-900" />
                    </div>
                  )}
                  {formData.is_active && (
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-2.5 h-2.5 text-green-900" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold text-white">Edit Branch</h3>
                    {formData.is_head_office && (
                      <div className="px-2 py-1 bg-yellow-400/20 border border-yellow-300/30 rounded-full backdrop-blur-sm">
                        <span className="text-yellow-100 text-xs font-medium flex items-center">
                          <Crown className="w-3 h-3 mr-1" />
                          Head Office
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-white/20 border border-white/30 text-white text-xs rounded-full font-mono backdrop-blur-sm">
                      {formData.code || 'NEW'}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm border text-xs ${
                      formData.is_active 
                        ? 'bg-green-400/20 border-green-300/30 text-green-100' 
                        : 'bg-red-400/20 border-red-300/30 text-red-100'
                    }`}>
                      {formData.is_active ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span className="font-medium">
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {hasChanges() && (
                      <div className="px-2 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full backdrop-blur-sm">
                        <span className="text-amber-100 text-xs font-medium">
                          Unsaved Changes
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-white/80 text-sm max-w-md">
                    {formData.name || 'Updating branch information and settings'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-3 mt-4">
              <div className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                <Activity className="w-3 h-3 text-white" />
                <span className="text-white/90 text-xs">Editing Mode</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                <Settings className="w-3 h-3 text-white" />
                <span className="text-white/90 text-xs">Configuration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-green-800 font-medium text-sm">Success!</h4>
                      <p className="text-green-700 text-xs">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-red-800 font-medium text-sm">Error</h4>
                      <p className="text-red-700 text-xs">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Basic Information</h4>
                    <p className="text-gray-600 text-sm">Core branch details and identity</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <InputField
                      label="Branch Name"
                      placeholder="Main Branch, Delhi Office, etc."
                      value={formData.name}
                      onChange={(value) => handleInputChange('name', value)}
                      required
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <InputField
                      label="Branch Code"
                      placeholder="BR001, DEL001, etc."
                      value={formData.code}
                      onChange={(value) => handleInputChange('code', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20 font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <InputField
                      label="Country"
                      placeholder="India"
                      value={formData.country}
                      onChange={(value) => handleInputChange('country', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                </div>

                {/* Enhanced Toggle Switches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_head_office}
                        onChange={(e) => handleInputChange('is_head_office', e.target.checked)}
                        className="w-4 h-4 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <div>
                          <span className="font-medium text-yellow-800 text-sm">Head Office</span>
                          <p className="text-xs text-yellow-700">Primary company location</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <span className="font-medium text-green-800 text-sm">Active Branch</span>
                          <p className="text-xs text-green-700">Currently operational</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Contact Information</h4>
                    <p className="text-gray-600 text-sm">Communication details and reach</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <InputField
                      label="Phone Number"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <InputField
                      label="Email Address"
                      type="email"
                      placeholder="branch@company.com"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Address Information</h4>
                    <p className="text-gray-600 text-sm">Physical location and address details</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-4 border border-purple-100">
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
              </div>

              {/* Operating Hours */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Operating Hours</h4>
                    <p className="text-gray-600 text-sm">Business hours and schedule</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.opening_time}
                        onChange={(e) => handleInputChange('opening_time', e.target.value)}
                        className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.closing_time}
                        onChange={(e) => handleInputChange('closing_time', e.target.value)}
                        className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview of operating hours */}
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Operating Schedule</span>
                  </div>
                  <p className="text-orange-700 text-sm">
                    {formData.opening_time && formData.closing_time 
                      ? `Open from ${formData.opening_time} to ${formData.closing_time}` 
                      : 'Set opening and closing times above'
                    }
                  </p>
                </div>
              </div>

              {/* Working Days */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Working Days</h4>
                    <p className="text-gray-600 text-sm">Select operational days of the week</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {weekDays.map(day => {
                    const isSelected = formData.working_days.split(',').includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleWorkingDaysChange(day)}
                        className={`p-3 text-sm rounded-xl border-2 transition-all duration-200 font-medium ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-indigo-500 shadow-lg transform scale-105'
                            : 'bg-white/70 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold text-xs">{day.slice(0, 3)}</div>
                          <div className="text-xs opacity-80">{day.slice(3)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected days preview */}
                <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800">Selected Working Days</span>
                  </div>
                  <p className="text-indigo-700 text-sm">
                    {formData.working_days 
                      ? formData.working_days.replace(/,/g, ', ') || 'None selected'
                      : 'No working days selected'
                    }
                  </p>
                </div>
              </div>

              {/* Add some bottom padding to prevent content being hidden behind the fixed footer */}
              <div className="h-20"></div>
            </form>
          </div>
        </div>

        {/* Permanent Fixed Bottom Bar */}
        <div className="flex-shrink-0 border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Editing: {branch.name}</span>
                </div>
                {hasChanges() && (
                  <div className="flex items-center space-x-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>You have unsaved changes</span>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving changes...</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleDiscard}
                  disabled={loading || !hasChanges()}
                  icon={<RotateCcw className="w-4 h-4" />}
                  className="border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Discard Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading || !hasChanges()}
                  icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Updating Branch...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes dash {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-dash {
          stroke-dasharray: 50;
          animation: dash 3s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}