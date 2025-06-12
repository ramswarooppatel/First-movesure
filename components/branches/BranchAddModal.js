"use client";
import { useState, useEffect } from 'react';
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
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  Zap,
  Target,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Activity,
  Lock,
  Unlock,
  Wand2,
  Edit3,
  Hash
} from 'lucide-react';

export default function BranchAddModal({ onClose, onSuccess }) {
  const { user, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Branch code management states
  const [isAutoCodeEnabled, setIsAutoCodeEnabled] = useState(true);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [codeValidation, setCodeValidation] = useState({ isValid: true, message: '' });
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  
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

  // Enhanced branch code generation with multiple patterns
  const generateBranchCode = (name, city, pattern = 'smart') => {
    if (!name) return '';
    
    const nameWords = name.trim().split(' ').filter(word => word.length > 0);
    const cityName = city?.trim() || '';
    
    switch (pattern) {
      case 'smart': {
        // Smart pattern: CityPrefix + NameInitials + RandomNumber
        const namePrefix = nameWords.map(word => word.charAt(0).toUpperCase()).join('').slice(0, 3);
        const cityPrefix = cityName ? cityName.slice(0, 3).toUpperCase() : '';
        const randomNum = Math.floor(Math.random() * 900) + 100;
        
        if (cityPrefix) {
          return `${cityPrefix}${namePrefix}${randomNum}`;
        } else {
          return `BR${namePrefix}${randomNum}`;
        }
      }
      case 'simple': {
        // Simple pattern: BR + Sequential number
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        return `BR${randomNum}`;
      }
      case 'descriptive': {
        // Descriptive pattern: Full name abbreviation
        let code = '';
        nameWords.forEach(word => {
          if (word.length >= 3) {
            code += word.slice(0, 3).toUpperCase();
          } else {
            code += word.toUpperCase();
          }
        });
        const randomNum = Math.floor(Math.random() * 99) + 10;
        return `${code.slice(0, 6)}${randomNum}`;
      }
      case 'location': {
        // Location-based pattern
        const cityCode = cityName ? cityName.slice(0, 4).toUpperCase() : 'MAIN';
        const nameCode = nameWords[0] ? nameWords[0].slice(0, 2).toUpperCase() : 'BR';
        const randomNum = Math.floor(Math.random() * 999) + 100;
        return `${cityCode}${nameCode}${randomNum}`;
      }
      default:
        return generateBranchCode(name, city, 'smart');
    }
  };

  // Validate branch code format and uniqueness
  const validateBranchCode = async (code) => {
    if (!code || code.length < 3) {
      return { isValid: false, message: 'Branch code must be at least 3 characters long' };
    }
    
    if (!/^[A-Z0-9]+$/i.test(code)) {
      return { isValid: false, message: 'Branch code can only contain letters and numbers' };
    }
    
    if (code.length > 15) {
      return { isValid: false, message: 'Branch code cannot exceed 15 characters' };
    }

    // Check uniqueness (you can implement this API call)
    try {
      setIsCheckingCode(true);
      // This would be an API call to check if code exists
      // const exists = await BranchService.checkCodeExists(code, getAuthHeaders());
      // For now, we'll simulate this
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate some existing codes for demo
      const existingCodes = ['BR001', 'MAIN123', 'DELHI456'];
      const exists = existingCodes.includes(code.toUpperCase());
      
      if (exists) {
        return { isValid: false, message: 'This branch code already exists. Please choose a different one.' };
      }
      
      return { isValid: true, message: 'Branch code is available!' };
    } catch (error) {
      return { isValid: false, message: 'Error checking code availability' };
    } finally {
      setIsCheckingCode(false);
    }
  };

  // Auto-generate code when name or city changes (only if auto mode is enabled)
  useEffect(() => {
    if (isAutoCodeEnabled && formData.name && !customCodeInput) {
      const autoCode = generateBranchCode(formData.name, formData.city);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  }, [formData.name, formData.city, isAutoCodeEnabled]);

  // Validate code when it changes
  useEffect(() => {
    if (formData.code) {
      validateBranchCode(formData.code).then(setCodeValidation);
    }
  }, [formData.code]);

  // Real-time validation
  const validateField = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Branch name is required';
        } else if (value.length < 2) {
          errors.name = 'Branch name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
      case 'code':
        if (!value.trim()) {
          errors.code = 'Branch code is required';
        } else if (value.length < 3) {
          errors.code = 'Branch code must be at least 3 characters';
        } else if (!/^[A-Z0-9]+$/i.test(value)) {
          errors.code = 'Branch code can only contain letters and numbers';
        } else {
          delete errors.code;
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{9,15}$/.test(value.replace(/\s+/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    validateField(field, value);
    
    // Auto-generate code when name changes (only in auto mode)
    if (field === 'name' && value && isAutoCodeEnabled) {
      const autoCode = generateBranchCode(value, formData.city);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  };

  // Handle branch code input changes
  const handleCodeChange = (value) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (isAutoCodeEnabled) {
      // If auto mode, store as custom input but don't update form data yet
      setCustomCodeInput(upperValue);
    } else {
      // If manual mode, update form data directly
      setFormData(prev => ({ ...prev, code: upperValue }));
      validateField('code', upperValue);
    }
  };

  // Toggle between auto and manual code generation
  const toggleCodeMode = () => {
    if (isAutoCodeEnabled) {
      // Switching to manual mode
      setIsAutoCodeEnabled(false);
      if (customCodeInput) {
        setFormData(prev => ({ ...prev, code: customCodeInput }));
      }
    } else {
      // Switching to auto mode
      setIsAutoCodeEnabled(true);
      setCustomCodeInput('');
      const autoCode = generateBranchCode(formData.name, formData.city);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  };

  // Generate new code with different patterns
  const regenerateCode = (pattern = 'smart') => {
    const newCode = generateBranchCode(formData.name, formData.city, pattern);
    setFormData(prev => ({ ...prev, code: newCode }));
    if (!isAutoCodeEnabled) {
      setCustomCodeInput(newCode);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address || '',
      city: addressData.city || '',
      state: addressData.state || '',
      pincode: addressData.pincode || ''
    }));
    
    // Auto-update code if city changes and auto mode is enabled
    if (addressData.city && formData.name && isAutoCodeEnabled) {
      const autoCode = generateBranchCode(formData.name, addressData.city);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
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

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.code.trim() && !validationErrors.name && !validationErrors.code && codeValidation.isValid;
      case 2:
        return !validationErrors.email && !validationErrors.phone;
      case 3:
        return true; // Address is optional
      case 4:
        return formData.opening_time && formData.closing_time;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Branch name is required');
      setCurrentStep(1);
      return;
    }

    if (!formData.code.trim()) {
      setError('Branch code is required');
      setCurrentStep(1);
      return;
    }

    if (!codeValidation.isValid) {
      setError('Please fix the branch code issue before submitting');
      setCurrentStep(1);
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix all validation errors before submitting');
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
        }, 2000);
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

  const steps = [
    { id: 1, title: 'Basic Info', icon: Building2, description: 'Branch details' },
    { id: 2, title: 'Contact', icon: Phone, description: 'Communication' },
    { id: 3, title: 'Address', icon: MapPin, description: 'Location details' },
    { id: 4, title: 'Operations', icon: Clock, description: 'Working hours' }
  ];

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 8; // Total required fields
    
    if (formData.name.trim()) completed++;
    if (formData.code.trim()) completed++;
    if (formData.phone.trim()) completed++;
    if (formData.email.trim()) completed++;
    if (formData.address.trim()) completed++;
    if (formData.city.trim()) completed++;
    if (formData.opening_time) completed++;
    if (formData.closing_time) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const codeGenerationPatterns = [
    { key: 'smart', label: 'Smart', description: 'City + Name + Number', icon: Sparkles },
    { key: 'simple', label: 'Simple', description: 'BR + Number', icon: Hash },
    { key: 'descriptive', label: 'Descriptive', description: 'Full Name + Number', icon: Edit3 },
    { key: 'location', label: 'Location', description: 'Location Based', icon: MapPin }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Enhanced Background with Animated Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/10 rounded-full animate-pulse"></div>
      </div>

      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-white/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header with Progress */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden flex-shrink-0">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-spin-slow"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 animate-bounce"></div>
            
            {/* Flowing lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="animate-dash" />
              <path d="M0,60 Q25,80 50,60 T100,70" stroke="currentColor" strokeWidth="0.3" fill="none" className="animate-dash" style={{animationDelay: '1s'}} />
            </svg>
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {/* Enhanced Icon Container */}
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="w-4 h-4 text-yellow-900" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-3xl font-bold text-white">Create New Branch</h3>
                    <div className="px-3 py-1 bg-white/20 border border-white/30 rounded-full backdrop-blur-sm">
                      <span className="text-white text-sm font-medium">Step {currentStep}/4</span>
                    </div>
                  </div>
                  
                  <p className="text-blue-100 text-lg">
                    {steps.find(s => s.id === currentStep)?.description || 'Setting up your new branch location'}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-80 bg-white/20 rounded-full h-2 mt-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Completion Percentage */}
                  <div className="flex items-center space-x-2 mt-2">
                    <Activity className="w-4 h-4 text-green-300" />
                    <span className="text-green-200 text-sm font-medium">
                      {getCompletionPercentage()}% Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={loading}
                className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300 ${
                    step.id === currentStep ? 'bg-white/20 scale-105' : 'bg-white/10'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      step.id < currentStep 
                        ? 'bg-green-500 text-white' 
                        : step.id === currentStep 
                          ? 'bg-yellow-400 text-yellow-900' 
                          : 'bg-white/20 text-white/60'
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-sm font-medium ${
                        step.id === currentStep ? 'text-white' : 'text-white/80'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-white/20 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Basic Information</h4>
                      <p className="text-gray-600 text-sm">Essential branch details and identity</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <InputField
                        label="Branch Name"
                        placeholder="Main Branch, Delhi Office, etc."
                        value={formData.name}
                        onChange={(value) => handleInputChange('name', value)}
                        required
                        error={validationErrors.name}
                        className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Branch Code
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={toggleCodeMode}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                              isAutoCodeEnabled 
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {isAutoCodeEnabled ? <Wand2 className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                            <span>{isAutoCodeEnabled ? 'Auto' : 'Manual'}</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          value={isAutoCodeEnabled ? formData.code : customCodeInput}
                          onChange={(e) => handleCodeChange(e.target.value)}
                          placeholder={isAutoCodeEnabled ? "Auto-generated code" : "Enter custom code"}
                          disabled={isAutoCodeEnabled}
                          className={`w-full px-3 py-2 pr-24 bg-white/70 backdrop-blur-sm border rounded-lg font-mono text-sm transition-all ${
                            isAutoCodeEnabled 
                              ? 'border-gray-200/50 bg-gray-50/70 text-gray-700 cursor-not-allowed' 
                              : 'border-gray-200/50 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400'
                          } ${
                            formData.code && codeValidation.isValid 
                              ? 'border-green-500 bg-green-50/70' 
                              : formData.code && !codeValidation.isValid 
                                ? 'border-red-500 bg-red-50/70' 
                                : ''
                          }`}
                        />
                        
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          {isCheckingCode && (
                            <div className="p-1">
                              <Loader className="w-3 h-3 animate-spin text-blue-500" />
                            </div>
                          )}
                          
                          {formData.code && !isCheckingCode && (
                            <div className="p-1">
                              {codeValidation.isValid ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => copyToClipboard(formData.code)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Copy Code"
                            disabled={!formData.code}
                          >
                            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Code validation message */}
                      {formData.code && codeValidation.message && (
                        <p className={`text-xs ${codeValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {codeValidation.message}
                        </p>
                      )}
                      
                      {/* Code generation info */}
                      {isAutoCodeEnabled && formData.code && (
                        <p className="text-xs text-gray-500">
                          Generated from: {formData.name || 'Branch Name'} + {formData.city || 'City'}
                        </p>
                      )}
                      
                      {/* Code generation patterns */}
                      {isAutoCodeEnabled && formData.name && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100">
                          <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Code Generation Patterns</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {codeGenerationPatterns.map(pattern => (
                              <button
                                key={pattern.key}
                                type="button"
                                onClick={() => regenerateCode(pattern.key)}
                                className="flex items-center space-x-2 px-2 py-1 bg-white/70 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                              >
                                <pattern.icon className="w-3 h-3 text-blue-600" />
                                <div className="text-left">
                                  <div className="font-medium text-blue-800">{pattern.label}</div>
                                  <div className="text-blue-600">{pattern.description}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {validationErrors.code && (
                        <p className="text-red-600 text-xs">{validationErrors.code}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <InputField
                      label="Country"
                      placeholder="India"
                      value={formData.country}
                      onChange={(value) => handleInputChange('country', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>

                  {/* Enhanced Toggle Switches */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_head_office}
                          onChange={(e) => handleInputChange('is_head_office', e.target.checked)}
                          className="w-5 h-5 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5 text-yellow-600" />
                          <div>
                            <span className="font-medium text-yellow-800">Head Office</span>
                            <p className="text-xs text-yellow-700">Primary company location</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => handleInputChange('is_active', e.target.checked)}
                          className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <span className="font-medium text-green-800">Active Branch</span>
                            <p className="text-xs text-green-700">Currently operational</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <InputField
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value)}
                        error={validationErrors.phone}
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
                        error={validationErrors.email}
                        className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-green-400 focus:ring-green-400/20"
                      />
                    </div>
                  </div>

                  {/* Contact Preview */}
                  {(formData.phone || formData.email) && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Contact Preview</span>
                      </div>
                      <div className="space-y-1">
                        {formData.phone && (
                          <p className="text-green-700 text-sm flex items-center">
                            <Phone className="w-3 h-3 mr-2" />
                            {formData.phone}
                          </p>
                        )}
                        {formData.email && (
                          <p className="text-green-700 text-sm flex items-center">
                            <Mail className="w-3 h-3 mr-2" />
                            {formData.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Address Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
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

                  {/* Address Preview */}
                  {(formData.address || formData.city || formData.state) && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Address Preview</span>
                      </div>
                      <p className="text-purple-700">
                        {[formData.address, formData.city, formData.state, formData.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Operations */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Operating Hours</h4>
                      <p className="text-gray-600 text-sm">Working schedule and business hours</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
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
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Operating Schedule</span>
                    </div>
                    <p className="text-orange-700 text-lg font-semibold">
                      {formData.opening_time && formData.closing_time 
                        ? `${formData.opening_time} - ${formData.closing_time}`
                        : 'Select opening and closing times'
                      }
                    </p>
                  </div>

                  {/* Working Days */}
                  <div className="mt-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <h5 className="text-lg font-semibold text-gray-900">Working Days</h5>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                      {weekDays.map(day => {
                        const isSelected = formData.working_days.split(',').includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleWorkingDaysChange(day)}
                            className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              isSelected
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-500 shadow-lg'
                                : 'bg-white/70 text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-bold text-sm">{day.slice(0, 3)}</div>
                              <div className="text-xs opacity-80">{day.slice(3)}</div>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-yellow-900" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected days preview */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-800">Selected Working Days</span>
                      </div>
                      <p className="text-indigo-700">
                        {formData.working_days 
                          ? formData.working_days.replace(/,/g, ', ') || 'None selected'
                          : 'No working days selected'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error & Success Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-red-800 font-medium">Error</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-green-800 font-medium">Success!</h4>
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Progress Indicator */}
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Progress: {getCompletionPercentage()}%
                </span>
              </div>
              
              {/* Branch Code Mode Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                {isAutoCodeEnabled ? <Wand2 className="w-4 h-4 text-blue-600" /> : <Edit3 className="w-4 h-4 text-purple-600" />}
                <span className="text-sm font-medium">
                  {isAutoCodeEnabled ? 'Auto Code' : 'Custom Code'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Previous Button */}
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={loading}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </Button>
              )}
              
              {/* Next/Submit Button */}
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading || Object.keys(validationErrors).length > 0 || !codeValidation.isValid}
                  icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                >
                  {loading ? 'Creating Branch...' : 'Create Branch'}
                </Button>
              )}
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
          animation: dash 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}