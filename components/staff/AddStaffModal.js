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
  Plus, 
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
  AlertTriangle,
  Crown,
  Sparkles,
  UserPlus,
  Zap,
  Save,
  Target,
  Globe,
  Award,
  TrendingUp,
  Activity,
  Star,
  ArrowRight,
  ArrowLeft,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function AddStaffModal({ branches, onClose, onSuccess }) {
  const { getAuthHeaders } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    username: '',
    designation: '',
    department: '',
    role: 'branch_staff',
    branch_id: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    aadhar_number: '',
    pan_number: '',
    salary: '',
    joining_date: new Date().toISOString().split('T')[0],
    reporting_manager_id: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    is_active: true,
    profile_picture_url: '',
    phone_verified: false,
    email_verified: false,
    pan_verified: false,
    aadhar_verified: false,
    password: '',
    language_preference: 'en'
  });

  const steps = [
    { 
      id: 1, 
      title: 'Personal Info', 
      icon: User, 
      description: 'Basic details & photo',
      fields: ['first_name', 'last_name', 'date_of_birth', 'gender']
    },
    { 
      id: 2, 
      title: 'Contact & Verification', 
      icon: Phone, 
      description: 'Email & phone verification (Required)',
      fields: ['email', 'phone'],
      requiresVerification: true
    },
    { 
      id: 3, 
      title: 'Emergency & Address', 
      icon: MapPin, 
      description: 'Emergency contact & address',
      fields: ['emergency_contact_name', 'address', 'city']
    },
    { 
      id: 4, 
      title: 'Identity Documents', 
      icon: CreditCard, 
      description: 'PAN & Aadhaar verification (Required if provided)',
      fields: ['pan_number', 'aadhar_number'],
      requiresVerification: true
    },
    { 
      id: 5, 
      title: 'Professional', 
      icon: Briefcase, 
      description: 'Job details & assignment',
      fields: ['designation', 'role', 'branch_id']
    },
    { 
      id: 6, 
      title: 'Account Setup', 
      icon: Lock, 
      description: 'Username & password',
      fields: ['username', 'password']
    }
  ];

  // Enhanced validation that includes verification requirements
  const validateField = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'first_name':
        if (!value.trim()) {
          errors.first_name = 'First name is required';
        } else if (value.length < 2) {
          errors.first_name = 'First name must be at least 2 characters';
        } else {
          delete errors.first_name;
        }
        break;
      case 'last_name':
        if (!value.trim()) {
          errors.last_name = 'Last name is required';
        } else if (value.length < 2) {
          errors.last_name = 'Last name must be at least 2 characters';
        } else {
          delete errors.last_name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{9,15}$/.test(value.replace(/\s+/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'username':
        if (!value.trim()) {
          errors.username = 'Username is required';
        } else if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else {
          delete errors.username;
        }
        break;
      case 'password':
        if (!value.trim()) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');

    validateField(field, value);

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

  const getCompletionPercentage = () => {
    const totalFields = 12; // Key required fields
    let completed = 0;
    
    if (formData.first_name.trim()) completed++;
    if (formData.last_name.trim()) completed++;
    if (formData.email.trim()) completed++;
    if (formData.phone.trim()) completed++;
    if (formData.username.trim()) completed++;
    if (formData.password.trim()) completed++;
    if (formData.role) completed++;
    if (formData.designation.trim()) completed++;
    if (formData.address.trim()) completed++;
    if (formData.city.trim()) completed++;
    if (formData.joining_date) completed++;
    if (formData.profile_picture_url) completed++;
    
    return Math.round((completed / totalFields) * 100);
  };

  // Enhanced step validation with verification requirements
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.first_name.trim() && 
               formData.last_name.trim() && 
               !validationErrors.first_name && 
               !validationErrors.last_name;
      case 2:
        // Email and phone must be verified to proceed
        return formData.email.trim() && 
               formData.phone.trim() && 
               !validationErrors.email && 
               !validationErrors.phone &&
               formData.email_verified &&
               formData.phone_verified;
      case 3:
        return true; // Emergency contact and address are optional
      case 4:
        // If PAN or Aadhaar is provided, it must be verified
        const panOk = !formData.pan_number || (formData.pan_number && formData.pan_verified);
        const aadhaarOk = !formData.aadhar_number || (formData.aadhar_number && formData.aadhar_verified);
        return panOk && aadhaarOk;
      case 5:
        return formData.role && formData.designation.trim();
      case 6:
        return usernameValid && 
               formData.password.trim() && 
               passwordStrength >= 3 && 
               !validationErrors.password;
      default:
        return true;
    }
  };

  const getStepValidationMessage = (step) => {
    switch (step) {
      case 2:
        if (!formData.email_verified) return 'Email verification required';
        if (!formData.phone_verified) return 'Phone verification required';
        return '';
      case 4:
        if (formData.pan_number && !formData.pan_verified) return 'PAN verification required';
        if (formData.aadhar_number && !formData.aadhar_verified) return 'Aadhaar verification required';
        return '';
      default:
        return '';
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      const message = getStepValidationMessage(currentStep);
      if (message) {
        setError(message);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(''); // Clear errors when going back
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

  // Photo upload handler - CORRECTED
  const handlePhotoChange = (photoData, filename) => {
    if (photoData) {
      handleInputChange('profile_picture_url', photoData);
    } else {
      handleInputChange('profile_picture_url', '');
    }
  };

  // PAN verification handlers
  const handlePANChange = (panNumber) => {
    handleInputChange('pan_number', panNumber);
    // Reset verification when PAN changes
    if (formData.pan_verified && panNumber !== formData.pan_number) {
      handleInputChange('pan_verified', false);
    }
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
    // Reset verification when Aadhaar changes
    if (formData.aadhar_verified && aadhaarNumber !== formData.aadhar_number) {
      handleInputChange('aadhar_verified', false);
    }
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
    
    // Final comprehensive validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields (First Name, Last Name, Email, Phone)');
      return;
    }

    if (!formData.email_verified) {
      setError('Email verification is required');
      return;
    }

    if (!formData.phone_verified) {
      setError('Phone verification is required');
      return;
    }

    if (formData.pan_number && !formData.pan_verified) {
      setError('PAN verification is required if PAN number is provided');
      return;
    }

    if (formData.aadhar_number && !formData.aadhar_verified) {
      setError('Aadhaar verification is required if Aadhaar number is provided');
      return;
    }

    if (!usernameValid) {
      setError('Please choose a valid and unique username');
      return;
    }

    if (!formData.password || passwordStrength < 3) {
      setError('Please create a strong password (Fair strength or better)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await StaffService.createStaff(formData, getAuthHeaders());

      if (result.success) {
        setSuccess('🎉 Staff member created successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Create staff error:', error);
      setError('Failed to create staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin', icon: Crown, color: 'purple' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'blue' },
    { value: 'branch_manager', label: 'Branch Manager', icon: Briefcase, color: 'green' },
    { value: 'branch_staff', label: 'Branch Staff', icon: User, color: 'yellow' },
    { value: 'viewer', label: 'Viewer', icon: Eye, color: 'gray' }
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
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
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden flex-shrink-0">
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
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="w-4 h-4 text-yellow-900" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-3xl font-bold text-white">Add New Staff Member</h3>
                    <div className="px-3 py-1 bg-white/20 border border-white/30 rounded-full backdrop-blur-sm">
                      <span className="text-white text-sm font-medium">Step {currentStep}/{steps.length}</span>
                    </div>
                  </div>
                  
                  <p className="text-blue-100 text-lg">
                    {steps.find(s => s.id === currentStep)?.description || 'Creating comprehensive staff profile'}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-80 bg-white/20 rounded-full h-2 mt-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
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
            <div className="flex items-center justify-center space-x-2 mt-6 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300 ${
                    step.id === currentStep ? 'bg-white/20 scale-105' : 'bg-white/10'
                  }`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      step.id < currentStep 
                        ? 'bg-green-500 text-white' 
                        : step.id === currentStep 
                          ? 'bg-yellow-400 text-yellow-900' 
                          : 'bg-white/20 text-white/60'
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : step.requiresVerification ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <step.icon className="w-3 h-3" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-xs font-medium ${
                        step.id === currentStep ? 'text-white' : 'text-white/80'
                      }`}>
                        {step.title}
                      </p>
                      {step.requiresVerification && (
                        <p className="text-xs text-yellow-200">Verification Required</p>
                      )}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-4 h-0.5 bg-white/20 mx-1"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area - (rest of the component remains the same but with enhanced verification indicators) */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Step 1: Personal Information - (same as before) */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Profile Photo</h4>
                      <p className="text-gray-600 text-sm">Add a professional photo for identification</p>
                    </div>
                  </div>
                
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
                  titleColor="text-purple-900"
                  autoGenerateFilename={true}
                  showPreview={true}
                  showFilename={true}
                />
                
                </div>

                {/* Personal Details */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Personal Information</h4>
                      <p className="text-gray-600 text-sm">Basic personal details and information</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                      label="First Name *"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={(value) => handleInputChange('first_name', value)}
                      required
                      error={validationErrors.first_name}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                    <InputField
                      label="Middle Name"
                      placeholder="Enter middle name"
                      value={formData.middle_name}
                      onChange={(value) => handleInputChange('middle_name', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                    <InputField
                      label="Last Name *"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={(value) => handleInputChange('last_name', value)}
                      required
                      error={validationErrors.last_name}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.date_of_birth || ''}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all duration-200"
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
              </div>
            )}

            {/* Step 2: Contact & Verification - Enhanced with Verification Requirements */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Contact & Verification</h4>
                        <p className="text-gray-600 text-sm">Email and phone verification for security</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 rounded-lg">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">Verification Required</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Email Verification */}
                    <EmailVerificationComponent
                      value={formData.email || ''}
                      onChange={(value) => handleInputChange('email', value)}
                      onVerificationSuccess={handleEmailVerificationSuccess}
                      title="Email Verification *"
                      backgroundColor="bg-indigo-50"
                      borderColor="border-indigo-200"
                      iconColor="bg-indigo-500"
                      titleColor="text-indigo-900"
                      required={true}
                      checkAvailability={true}
                      isVerified={formData.email_verified}
                    />

                    {/* Phone Verification */}
                    <PhoneVerificationComponent
                      value={formData.phone || ''}
                      onChange={(value) => handleInputChange('phone', value)}
                      onVerificationSuccess={handlePhoneVerificationSuccess}
                      title="Mobile Verification *"
                      backgroundColor="bg-green-50"
                      borderColor="border-green-200"
                      iconColor="bg-green-500"
                      titleColor="text-green-900"
                      required={true}
                      isVerified={formData.phone_verified}
                    />

                    {/* Verification Status */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-green-50/50 rounded-xl border border-blue-100">
                      <div className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-600" />
                        Verification Status:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className={`flex items-center p-3 rounded-lg transition-all ${formData.email_verified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {formData.email_verified ? <CheckCircle className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                          <span className="font-medium">Email verified</span>
                        </div>
                        <div className={`flex items-center p-3 rounded-lg transition-all ${formData.phone_verified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {formData.phone_verified ? <CheckCircle className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                          <span className="font-medium">Phone verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact & Address - (same as before) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Emergency Contact */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Emergency Contact</h4>
                      <p className="text-gray-600 text-sm">Emergency contact person details</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Emergency Contact Name"
                      placeholder="Full name of emergency contact"
                      value={formData.emergency_contact_name}
                      onChange={(value) => handleInputChange('emergency_contact_name', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-red-400 focus:ring-red-400/20"
                    />
                    <InputField
                      label="Emergency Contact Phone"
                      placeholder="+91 9876543210"
                      value={formData.emergency_contact_phone}
                      onChange={(value) => handleInputChange('emergency_contact_phone', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-red-400 focus:ring-red-400/20"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Address Information</h4>
                      <p className="text-gray-600 text-sm">Residential address details</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl p-4 border border-orange-100">
                    <AddressComponent
                      data={{
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        country: formData.country
                      }}
                      onChange={handleAddressChange}
                      showCountry={false}
                      showTitle={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Identity Documents - Enhanced with Verification Requirements */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Identity Documents</h4>
                        <p className="text-gray-600 text-sm">PAN and Aadhaar verification (required if provided)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 rounded-lg">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">Verification Required</span>
                    </div>
                  </div>
                  
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
                      required={!!formData.pan_number}
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
                      required={!!formData.aadhar_number}
                      placeholder="1234 5678 9012"
                      isVerified={formData.aadhar_verified}
                    />

                    {/* Document Verification Status */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-xl border border-yellow-100">
                      <div className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-yellow-600" />
                        Document Verification Status:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className={`flex items-center p-3 rounded-lg transition-all ${
                          !formData.pan_number ? 'bg-gray-50 text-gray-600 border border-gray-200' :
                          formData.pan_verified ? 'bg-green-50 text-green-700 border border-green-200' : 
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {!formData.pan_number ? <AlertCircle className="w-4 h-4 mr-2" /> :
                           formData.pan_verified ? <CheckCircle className="w-4 h-4 mr-2" /> : 
                           <X className="w-4 h-4 mr-2" />}
                          <span className="font-medium">
                            {!formData.pan_number ? 'PAN not provided' : 
                             formData.pan_verified ? 'PAN verified' : 'PAN verification required'}
                          </span>
                        </div>
                        <div className={`flex items-center p-3 rounded-lg transition-all ${
                          !formData.aadhar_number ? 'bg-gray-50 text-gray-600 border border-gray-200' :
                          formData.aadhar_verified ? 'bg-green-50 text-green-700 border border-green-200' : 
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {!formData.aadhar_number ? <AlertCircle className="w-4 h-4 mr-2" /> :
                           formData.aadhar_verified ? <CheckCircle className="w-4 h-4 mr-2" /> : 
                           <X className="w-4 h-4 mr-2" />}
                          <span className="font-medium">
                            {!formData.aadhar_number ? 'Aadhaar not provided' : 
                             formData.aadhar_verified ? 'Aadhaar verified' : 'Aadhaar verification required'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Professional Information - (same as before) */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Professional Information</h4>
                      <p className="text-gray-600 text-sm">Job role, department and branch assignment</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                      label="Designation *"
                      placeholder="Software Engineer"
                      value={formData.designation}
                      onChange={(value) => handleInputChange('designation', value)}
                      required
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-gray-400 focus:ring-gray-400/20"
                    />
                    <InputField
                      label="Department"
                      placeholder="Engineering"
                      value={formData.department}
                      onChange={(value) => handleInputChange('department', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-gray-400 focus:ring-gray-400/20"
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 transition-all duration-200"
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Branch Assignment
                      </label>
                      <select
                        value={formData.branch_id}
                        onChange={(e) => handleInputChange('branch_id', e.target.value)}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 transition-all duration-200"
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name} {branch.is_head_office && '(Head Office)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        value={formData.joining_date}
                        onChange={(e) => handleInputChange('joining_date', e.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 transition-all duration-200"
                      />
                    </div>

                    <InputField
                      label="Salary"
                      type="number"
                      placeholder="50000"
                      value={formData.salary}
                      onChange={(value) => handleInputChange('salary', value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:border-gray-400 focus:ring-gray-400/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Account Setup - (same as before) */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Account Credentials</h4>
                      <p className="text-gray-600 text-sm">Username and password for system access</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Username Field with Validation */}
                    <UsernameField
                      value={formData.username || ''}
                      onChange={(value) => handleInputChange('username', value)}
                      onValidationChange={setUsernameValid}
                      firstName={formData.first_name}
                      lastName={formData.last_name}
                      required={true}
                    />
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password || ''}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-200"
                          required
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
                        <div className="mt-3">
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

                      {validationErrors.password && (
                        <p className="text-red-600 text-xs">{validationErrors.password}</p>
                      )}
                    </div>
                  </div>

                  {/* Validation Status */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-xl border border-purple-100">
                    <div className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-purple-600" />
                      Account Setup Progress:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className={`flex items-center p-3 rounded-lg transition-all ${usernameValid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {usernameValid ? <CheckCircle className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                        <span className="font-medium">Username validated</span>
                      </div>
                      <div className={`flex items-center p-3 rounded-lg transition-all ${passwordStrength >= 3 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {passwordStrength >= 3 ? <CheckCircle className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                        <span className="font-medium">Strong password</span>
                      </div>
                      <div className={`flex items-center p-3 rounded-lg transition-all ${formData.email_verified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                        {formData.email_verified ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                        <span className="font-medium">Email verified</span>
                      </div>
                      <div className={`flex items-center p-3 rounded-lg transition-all ${formData.phone_verified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                        {formData.phone_verified ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                        <span className="font-medium">Phone verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                    <label className="flex items-center space-x-3 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                      />
                      <span className="font-medium text-gray-900 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Active Staff Member
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mt-2 ml-8">
                      Active staff members can log in to the system immediately
                    </p>
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
              
              {/* Step Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                <Star className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Step {currentStep} of {steps.length}
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
                  icon={<ChevronLeft className="w-4 h-4" />}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </Button>
              )}
              
              {/* Next/Submit Button */}
              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  icon={<ChevronRight className="w-4 h-4" />}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading || !isStepValid(currentStep)}
                  icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                >
                  {loading ? 'Creating Staff...' : 'Create Staff Member'}
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