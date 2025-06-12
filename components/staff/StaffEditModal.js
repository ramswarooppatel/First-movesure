"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StaffService } from '@/services/staffService';
import InputField from '@/components/common/InputField';
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
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  Shield, 
  UserCheck, 
  Building,
  ChevronLeft, 
  ChevronRight,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Lock,
  Users,
  DollarSign,
  Clock,
  UserPlus,
  Smartphone,
  Globe,
  Target,
  Zap,
  Copy,
  RefreshCw,
  Info,
  Hash,
  FileText,
  Camera,
  MapPin as LocationIcon,
  Home,
  Settings,
  AlertTriangle,
  Eye,
  EyeOff,
  Briefcase,
  Activity
} from 'lucide-react';

export default function StaffEditModal({ staff, branches = [], onClose, onSuccess }) {
  const { getAuthHeaders, isAuthenticated, user } = useAuth();
  
  // Add debugging for auth state
  useEffect(() => {
    console.log('StaffEditModal auth state:', {
      isAuthenticated,
      user: user ? { id: user.id, email: user.email } : null,
      hasAuthHeaders: !!getAuthHeaders().Authorization
    });
  }, [isAuthenticated, user, getAuthHeaders]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const autoSaveRef = useRef(null);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Enhanced role hierarchy and permissions
  const roleHierarchy = {
    'super_admin': { level: 5, label: 'Super Admin', color: 'purple', icon: Shield },
    'admin': { level: 4, label: 'Admin', color: 'indigo', icon: Shield },
    'branch_manager': { level: 3, label: 'Branch Manager', color: 'blue', icon: Building2 },
    'branch_staff': { level: 2, label: 'Branch Staff', color: 'green', icon: User },
    'viewer': { level: 1, label: 'Viewer', color: 'gray', icon: User }
  };

  // Step-based configuration
  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      icon: User,
      color: 'blue',
      description: 'Update basic personal details and profile photo',
      fields: ['first_name', 'last_name', 'middle_name', 'date_of_birth', 'gender', 'language_preference', 'profile_picture_url']
    },
    {
      id: 2,
      title: 'Contact & Verification',
      icon: Smartphone,
      color: 'green',
      description: 'Communication details and verification status',
      fields: ['email', 'phone', 'phone_verified']
    },
    {
      id: 3,
      title: 'Professional Details',
      icon: Briefcase,
      color: 'purple',
      description: 'Job role, department, and work information',
      fields: ['username', 'designation', 'department', 'role', 'branch_id', 'salary', 'joining_date', 'reporting_manager_id']
    },
    {
      id: 4,
      title: 'Identity Documents',
      icon: CreditCard,
      color: 'yellow',
      description: 'PAN, Aadhaar, and other identity proofs',
      fields: ['aadhar_number', 'pan_number']
    },
    {
      id: 5,
      title: 'Address & Emergency',
      icon: Home,
      color: 'orange',
      description: 'Residential address and emergency contact',
      fields: ['address', 'city', 'state', 'pincode', 'emergency_contact_name', 'emergency_contact_phone']
    },
    {
      id: 6,
      title: 'Security & Status',
      icon: Settings,
      color: 'indigo',
      description: 'Account security and status settings',
      fields: ['password', 'is_active']
    }
  ];

  useEffect(() => {
    if (staff) {
      const initialData = {
        // Personal Information
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        middle_name: staff.middle_name || '',
        date_of_birth: staff.date_of_birth || '',
        gender: staff.gender || '',
        
        // Contact Information
        email: staff.email || '',
        phone: staff.phone || '',
        phone_verified: staff.phone_verified || false,
        
        // Professional Information
        username: staff.username || '',
        designation: staff.designation || '',
        department: staff.department || '',
        role: staff.role || 'branch_staff',
        branch_id: staff.branch_id || null,
        salary: staff.salary || '',
        joining_date: staff.joining_date || '',
        reporting_manager_id: staff.reporting_manager_id || null,
        
        // Address Information
        address: staff.address || '',
        city: staff.city || '',
        state: staff.state || '',
        pincode: staff.pincode || '',
        
        // Identity Documents
        aadhar_number: staff.aadhar_number || '',
        pan_number: staff.pan_number || '',
        
        // Emergency Contact
        emergency_contact_name: staff.emergency_contact_name || '',
        emergency_contact_phone: staff.emergency_contact_phone || '',
        
        // System Fields
        is_active: staff.is_active !== false,
        profile_picture_url: staff.profile_picture_url || '',
        language_preference: staff.language_preference || 'en',
        password: '' // Always empty for security
      };
      
      setFormData(initialData);
      setUsernameValid(true);
    }
  }, [staff]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isDirty) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [formData, autoSave, isDirty]);

  const handleAutoSave = async () => {
    if (!isDirty) return;
    
    try {
      const result = await StaffService.updateStaff(staff.id, sanitizeFormData(formData), getAuthHeaders());
      if (result.success) {
        setIsDirty(false);
        setSuccess('Auto-saved successfully');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Fix: Sanitize form data to handle UUID fields properly
  const sanitizeFormData = (data) => {
    const sanitized = { ...data };
    
    // Handle UUID fields - convert empty strings to null
    const uuidFields = ['branch_id', 'reporting_manager_id'];
    uuidFields.forEach(field => {
      if (sanitized[field] === '' || sanitized[field] === undefined) {
        sanitized[field] = null;
      }
    });

    // Remove empty password
    if (!sanitized.password || sanitized.password.trim() === '') {
      delete sanitized.password;
    }

    return sanitized;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (error) setError('');
    if (success) setSuccess('');

    // Real-time validation
    validateField(field, value);

    // Check password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateField = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Invalid email format';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-()]{10,}$/.test(value)) {
          errors.phone = 'Invalid phone format';
        } else {
          delete errors.phone;
        }
        break;
      case 'aadhar_number':
        if (value && !/^\d{12}$/.test(value.replace(/\s/g, ''))) {
          errors.aadhar_number = 'Aadhaar must be 12 digits';
        } else {
          delete errors.aadhar_number;
        }
        break;
      case 'pan_number':
        if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          errors.pan_number = 'Invalid PAN format (ABCDE1234F)';
        } else {
          delete errors.pan_number;
        }
        break;
    }
    
    setValidationErrors(errors);
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

  const getPasswordStrengthConfig = () => {
    const configs = [
      { text: '', color: 'bg-gray-200', textColor: 'text-gray-500' },
      { text: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-600' },
      { text: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-600' },
      { text: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
      { text: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' },
      { text: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' }
    ];
    return configs[passwordStrength] || configs[0];
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address || '',
      city: addressData.city || '',
      state: addressData.state || '',
      pincode: addressData.pincode || ''
    }));
    setIsDirty(true);
  };

  const handlePhotoChange = (photoData) => {
    if (photoData) {
      handleInputChange('profile_picture_url', photoData.photo);
    } else {
      handleInputChange('profile_picture_url', '');
    }
  };

  const handlePANChange = (panNumber) => {
    handleInputChange('pan_number', panNumber);
  };

  const handlePANVerificationSuccess = (panData) => {
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

  const handleAadhaarChange = (aadhaarNumber) => {
    handleInputChange('aadhar_number', aadhaarNumber);
  };

  const handlePhoneVerificationSuccess = () => {
    handleInputChange('phone_verified', true);
  };

  const validateCurrentStep = () => {
    const currentStepConfig = steps.find(s => s.id === currentStep);
    const errors = {};
    
    if (currentStep === 1) {
      if (!formData.first_name) errors.first_name = 'First name is required';
      if (!formData.last_name) errors.last_name = 'Last name is required';
    } else if (currentStep === 2) {
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.phone) errors.phone = 'Phone is required';
    } else if (currentStep === 3) {
      if (!formData.username) errors.username = 'Username is required';
      if (!formData.role) errors.role = 'Role is required';
      if (!usernameValid) errors.username = 'Please choose a valid username';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps
    const errors = {};
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!formData.role) errors.role = 'Role is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors');
      return;
    }

    if (!usernameValid) {
      setError('Please choose a valid username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sanitizedData = sanitizeFormData(formData);
      console.log('Submitting sanitized data:', sanitizedData);

      const result = await StaffService.updateStaff(staff.id, sanitizedData, getAuthHeaders());

      if (result.success) {
        setSuccess('Staff member updated successfully!');
        setIsDirty(false);
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

  const generateUsername = () => {
    if (formData.first_name && formData.last_name) {
      const username = `${formData.first_name.toLowerCase()}.${formData.last_name.toLowerCase()}`;
      handleInputChange('username', username);
    }
  };

  // Ensure branches is an array
  const availableBranches = Array.isArray(branches) ? branches : [];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'mr', label: 'Marathi' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'bn', label: 'Bengali' },
    { value: 'pa', label: 'Punjabi' }
  ];

  // Designation options
  const designationOptions = [
    'Manager',
    'Assistant Manager',
    'Team Lead',
    'Senior Executive',
    'Executive',
    'Associate',
    'Trainee',
    'Supervisor',
    'Coordinator',
    'Specialist',
    'Analyst',
    'Consultant',
    'Administrator',
    'Officer',
    'Assistant'
  ];

  // Department options
  const departmentOptions = [
    'Operations',
    'Sales',
    'Marketing',
    'Human Resources',
    'Finance',
    'IT',
    'Customer Service',
    'Administration',
    'Business Development',
    'Quality Assurance',
    'Logistics',
    'Procurement',
    'Legal',
    'Research & Development',
    'Training'
  ];

  // Enhanced fetch managers function with better error handling and UUID validation
  const fetchManagers = async (branchId = null, includeAll = true) => {
    try {
      setLoadingManagers(true);
      
      // Use getAuthHeaders() from auth context instead of localStorage directly
      const authHeaders = getAuthHeaders();
      
      if (!authHeaders.Authorization) {
        console.error('No authentication token available');
        setManagers([]);
        return;
      }
      
      // Build URL with parameters
      const params = new URLSearchParams();
      if (branchId) {
        // Ensure branchId is a valid UUID string
        const branchIdStr = String(branchId);
        params.append('branch_id', branchIdStr);
        params.append('include_all', includeAll.toString());
      }
      
      const url = `/api/staff/managers${params.toString() ? `?${params.toString()}` : ''}`;
      
      console.log('Fetching managers from:', url);
      console.log('Using auth headers:', authHeaders);
      console.log('Branch ID being sent:', branchId, 'Type:', typeof branchId);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      console.log('Managers API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Managers data:', result);
        setManagers(result.data || []);
        
        // Clear any previous errors
        if (error && error.includes('Failed to fetch managers')) {
          setError('');
        }
        
        // You can also use grouped data if needed
        if (result.grouped) {
          console.log('Grouped managers:', result.grouped);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to fetch managers:', response.status, errorData);
        setError(`Failed to fetch managers: ${errorData.error || 'Unknown error'}`);
        setManagers([]);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      setError(`Error fetching managers: ${error.message}`);
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  };

  // Update the useEffect to wait for authentication
  useEffect(() => {
    // Wait for authentication to be ready
    if (!isAuthenticated) {
      console.warn('Not authenticated, skipping manager fetch');
      return;
    }

    const authHeaders = getAuthHeaders();
    if (!authHeaders.Authorization) {
      console.warn('No authorization header available, skipping manager fetch');
      return;
    }

    // Add a small delay to ensure auth context is fully loaded
    const timeoutId = setTimeout(() => {
      if (formData.branch_id) {
        fetchManagers(formData.branch_id, true);
      } else {
        fetchManagers(null, false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [formData.branch_id, isAuthenticated, getAuthHeaders]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Photo Upload */}
            <PhotoUpload
              value={formData.profile_picture_url || ''}
              onChange={handlePhotoChange}
              label="Profile Photo"
              placeholder="Upload Profile Picture"
              maxSize={10}
              outputSize={400}
              previewSize={128}
              required={false}
              backgroundColor="bg-gradient-to-r from-blue-50 to-indigo-50"
              borderColor="border-blue-200"
              iconColor="bg-blue-500"
              buttonColor="bg-blue-600 hover:bg-blue-700"
              showCropModal={true}
              autoGenerateFilename={true}
            />

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="First Name *"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(value) => handleInputChange('first_name', value)}
                required
                error={validationErrors.first_name}
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
                error={validationErrors.last_name}
              />
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-blue-600" />
                  Language Preference
                </label>
                <select
                  value={formData.language_preference}
                  onChange={(e) => handleInputChange('language_preference', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <EmailVerificationComponent
              value={formData.email || ''}
              onChange={(value) => handleInputChange('email', value)}
              onVerificationSuccess={() => {}}
              title="Email Address"
              backgroundColor="bg-green-50"
              borderColor="border-green-200"
              iconColor="bg-green-500"
              titleColor="text-green-900"
              required={true}
              checkAvailability={false}
              isVerified={formData.phone_verified}
              error={validationErrors.email}
            />

            <PhoneVerificationComponent
              value={formData.phone || ''}
              onChange={(value) => handleInputChange('phone', value)}
              onVerificationSuccess={handlePhoneVerificationSuccess}
              title="Mobile Number"
              backgroundColor="bg-green-50"
              borderColor="border-green-200"
              iconColor="bg-green-500"
              titleColor="text-green-900"
              required={true}
              isVerified={formData.phone_verified}
              error={validationErrors.phone}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Branch *
              </label>
              <select
                value={formData.branch_id || ''}
                onChange={(e) => {
                  const branchId = e.target.value;
                  setFormData(prev => ({ 
                    ...prev, 
                    branch_id: branchId ? branchId : null, // Keep as string for UUID
                    reporting_manager_id: null // Reset manager when branch changes
                  }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} {branch.is_head_office ? '(Head Office)' : ''}
                  </option>
                ))}
              </select>
              {validationErrors.branch_id && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.branch_id}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Role *
              </label>
              <select
                value={formData.role || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                required
              >
                <option value="">Select Role</option>
                <option value="super_admin">OWNER</option>
                <option value="admin">Admin</option>
                <option value="branch_manager">Branch Manager</option>
                <option value="branch_staff">Branch Staff</option>
                <option value="viewer">Viewer</option>
              </select>
              {validationErrors.role && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Designation
              </label>
              <select
                value={formData.designation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select Designation</option>
                {designationOptions.map(designation => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or enter custom designation"
                  value={formData.designation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Department
              </label>
              <select
                value={formData.department || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select Department</option>
                {departmentOptions.map(department => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or enter custom department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Reporting Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="w-4 h-4 inline mr-1" />
                Reporting Manager
              </label>
              <select
                value={formData.reporting_manager_id || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  reporting_manager_id: e.target.value || null // Fix: Keep as string UUID, not parseInt
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                disabled={loadingManagers}
              >
                <option value="">Select Reporting Manager</option>
                
                {loadingManagers ? (
                  <option disabled>Loading managers...</option>
                ) : (
                  <>
                    {/* Group by role for better organization */}
                    {managers.filter(m => m.role === 'super_admin').length > 0 && (
                      <optgroup label="🔱 OWNERS">
                        {managers
                          .filter(m => m.role === 'super_admin')
                          .map(manager => (
                            <option key={manager.id} value={manager.id}>
                              👑 {manager.full_name} - {manager.branch_name}
                            </option>
                          ))
                        }
                      </optgroup>
                    )}
                    
                    {managers.filter(m => m.role === 'admin').length > 0 && (
                      <optgroup label="🛡️ ADMINS">
                        {managers
                          .filter(m => m.role === 'admin')
                          .map(manager => (
                            <option key={manager.id} value={manager.id}>
                              🛡️ {manager.full_name} - {manager.branch_name}
                            </option>
                          ))
                        }
                      </optgroup>
                    )}
                    
                    {managers.filter(m => m.role === 'branch_manager').length > 0 && (
                      <optgroup label="👥 BRANCH MANAGERS">
                        {managers
                          .filter(m => m.role === 'branch_manager')
                          .map(manager => (
                            <option key={manager.id} value={manager.id}>
                              👥 {manager.full_name} - {manager.branch_name}
                            </option>
                          ))
                        }
                      </optgroup>
                    )}
                  </>
                )}
              </select>
              
              {/* Enhanced status messages */}
              {loadingManagers && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Loading available managers...
                </div>
              )}
              
              {!loadingManagers && managers.length === 0 && formData.branch_id && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">No managers available in this branch</span>
                  </div>
                </div>
              )}
              
              {!loadingManagers && managers.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Found {managers.length} manager(s) - 
                  {managers.filter(m => m.role === 'super_admin').length} Owner(s), 
                  {managers.filter(m => m.role === 'admin').length} Admin(s), 
                  {managers.filter(m => m.role === 'branch_manager').length} Branch Manager(s)
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <PANComponent
              value={formData.pan_number || ''}
              onChange={handlePANChange}
              onVerificationSuccess={handlePANVerificationSuccess}
              title="PAN Card"
              backgroundColor="bg-yellow-50"
              borderColor="border-yellow-200"
              iconColor="bg-yellow-600"
              titleColor="text-yellow-900"
              required={false}
              placeholder="ABCDE1234F"
              error={validationErrors.pan_number}
            />

            <AadhaarComponent
              value={formData.aadhar_number || ''}
              onChange={handleAadhaarChange}
              onVerificationSuccess={() => {}}
              title="Aadhaar Card"
              backgroundColor="bg-orange-50"
              borderColor="border-orange-200"
              iconColor="bg-orange-600"
              titleColor="text-orange-900"
              required={false}
              placeholder="1234 5678 9012"
              error={validationErrors.aadhar_number}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <AddressComponent
              data={{
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
              }}
              onChange={handleAddressChange}
              title="Residential Address"
              backgroundColor="bg-orange-50"
              borderColor="border-orange-200"
              iconColor="bg-orange-500"
              titleColor="text-orange-900"
              prefix="Staff"
              showCountry={false}
            />

            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Emergency Contact Name"
                  placeholder="Full name of emergency contact"
                  value={formData.emergency_contact_name}
                  onChange={(value) => handleInputChange('emergency_contact_name', value)}
                  icon={<User className="w-4 h-4" />}
                />
                <InputField
                  label="Emergency Contact Phone"
                  placeholder="+91 9876543210"
                  value={formData.emergency_contact_phone}
                  onChange={(value) => handleInputChange('emergency_contact_phone', value)}
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                New Password
                <span className="ml-2 text-xs text-gray-500">(Leave blank to keep current)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password (optional)"
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
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
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getPasswordStrengthConfig().color}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getPasswordStrengthConfig().textColor}`}>
                      {getPasswordStrengthConfig().text}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-600">
                    <Info className="w-3 h-3 mr-1" />
                    <span>Use 8+ characters with mix of letters, numbers & symbols</span>
                  </div>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Status
              </h4>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                />
                <div>
                  <span className="font-semibold text-gray-900">Active Staff Member</span>
                  <p className="text-sm text-gray-600">Inactive staff members cannot access the system</p>
                </div>
              </label>
            </div>

            {/* Auto-save option */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                />
                <div>
                  <span className="font-semibold text-gray-900">Enable Auto-save</span>
                  <p className="text-sm text-gray-600">Automatically save changes every 3 seconds</p>
                </div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepConfig = steps.find(s => s.id === currentStep);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className={`relative bg-gradient-to-r from-${currentStepConfig?.color}-600 via-${currentStepConfig?.color}-700 to-${currentStepConfig?.color}-800 p-6 text-white`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <currentStepConfig.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Staff Member</h2>
                <p className="text-blue-100 mt-1">Update {formData.first_name} {formData.last_name}&apos;s information</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">{staff?.id?.slice(0, 8)}...</span>
                  </div>
                  {formData.role && roleHierarchy[formData.role] && (
                    <div className={`flex items-center space-x-2 bg-gradient-to-r from-${roleHierarchy[formData.role].color}-600 to-${roleHierarchy[formData.role].color}-600 rounded-full px-3 py-1`}>
                      {React.createElement(roleHierarchy[formData.role].icon, { className: "w-4 h-4" })}
                      <span className="text-sm font-medium">{roleHierarchy[formData.role].label}</span>
                    </div>
                  )}
                  <div className="px-3 py-1 bg-white/20 border border-white/30 rounded-full backdrop-blur-sm">
                    <span className="text-white text-sm font-medium">Step {currentStep}/{steps.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isDirty && (
                <div className="flex items-center space-x-2 bg-orange-500/20 rounded-lg px-3 py-2">
                  <Activity className="w-4 h-4 text-orange-200" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-white/90 text-sm mt-2">{currentStepConfig?.description}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto max-h-[calc(95vh-280px)]">
          <div className="p-6">
            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm mb-6">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm mb-6">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{success}</span>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className={`bg-gradient-to-br from-${currentStepConfig?.color}-50/50 to-${currentStepConfig?.color}-100/50 rounded-2xl p-6 border border-${currentStepConfig?.color}-200`}>
              <h3 className={`text-xl font-bold text-${currentStepConfig?.color}-900 mb-4 flex items-center`}>
                <currentStepConfig.icon className="w-6 h-6 mr-2" />
                {currentStepConfig?.title}
              </h3>
              
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date(staff?.updated_at || Date.now()).toLocaleDateString()}</span>
            </div>
            {Object.keys(validationErrors).length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{Object.keys(validationErrors).length} validation error(s)</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
                icon={<ChevronLeft className="w-4 h-4" />}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={loading}
                icon={<ChevronRight className="w-4 h-4" />}
                className={`bg-gradient-to-r from-${currentStepConfig?.color}-600 to-${currentStepConfig?.color}-700 hover:from-${currentStepConfig?.color}-700 hover:to-${currentStepConfig?.color}-800 shadow-lg`}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading || !usernameValid || Object.keys(validationErrors).length > 0}
                icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                {loading ? 'Updating...' : 'Update Staff Member'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}