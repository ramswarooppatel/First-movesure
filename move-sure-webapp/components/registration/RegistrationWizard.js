"use client";
 import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import LanguagePreferences from './steps/LanguagePreferences';
import CompanyDetails from './steps/CompanyDetails';
import OwnerDetails from './steps/OwnerDetails';
import IndustryCategory from './steps/IndustryCategory';
import BranchDetails from './steps/BranchDetails';
import StaffDetails from './steps/StaffDetails';
import RegistrationComplete from './steps/RegistrationComplete';
import { 
  Globe, 
  Building2, 
  User, 
  Factory, 
  MapPin, 
  Users, 
  CheckCircle, 
  Sparkles,
  Home,
  RotateCcw,
  Save,
  AlertTriangle
} from 'lucide-react';

const STORAGE_KEYS = {
  CURRENT_STEP: 'movesure_registration_current_step',
  FORM_DATA: 'movesure_registration_form_data',
  LAST_SAVED: 'movesure_registration_last_saved'
};

export default function RegistrationWizard({ onLoadingChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRestored, setIsRestored] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const [formData, setFormData] = useState({
    // Language & Theme Preferences
    language: 'en',
    theme: 'light',
    
    // Company Details (matches companies table)
    company: {
      name: '',
      registrationNumber: '',
      gstNumber: '',
      panNumber: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      description: '',
      logo: '',
      logoFileName: '',
      logoFileSize: '',
      logoUploadedAt: ''
    },
    
    // Owner Details (matches users table)
    owner: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      phoneVerified: false,
      emailVerified: false,
      username: '',
      password: '',
      aadhaarNumber: '',
      panNumber: '',
      dateOfBirth: '',
      gender: '',
      designation: 'Super Admin',
      department: 'Management',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      emergencyContactName: '',
      emergencyContactPhone: '',
      role: 'super_admin',
      photo: '',
      photoFileName: '',
      photoFileSize: '',
      photoUploadedAt: ''
    },
    
    // Industry & Category
    industry: '',
    category: '',
    
    // Branches (matches branches table)
    branches: [],
    
    // Staff (matches users table)
    staff: []
  });

  const steps = [
    { 
      title: 'Preferences', 
      component: LanguagePreferences,
      description: 'Language and theme settings',
      icon: <Globe className="w-6 h-6" />,
      estimatedTime: '1 min',
      required: true
    },
    { 
      title: 'Company Info', 
      component: CompanyDetails,
      description: 'Business registration details',
      icon: <Building2 className="w-6 h-6" />,
      estimatedTime: '3 min',
      required: true
    },
    { 
      title: 'Admin Details', 
      component: OwnerDetails,
      description: 'Super admin account setup',
      icon: <User className="w-6 h-6" />,
      estimatedTime: '2 min',
      required: true
    },
    { 
      title: 'Business Category', 
      component: IndustryCategory,
      description: 'Industry and business type',
      icon: <Factory className="w-6 h-6" />,
      estimatedTime: '1 min',
      required: true
    },
    { 
      title: 'Branch Setup', 
      component: BranchDetails,
      description: 'Configure business locations',
      icon: <MapPin className="w-6 h-6" />,
      estimatedTime: '2 min',
      optional: true,
      required: false
    },
    { 
      title: 'Team Setup', 
      component: StaffDetails,
      description: 'Add staff members',
      icon: <Users className="w-6 h-6" />,
      estimatedTime: '3 min',
      optional: true,
      required: false
    },
    { 
      title: 'Complete', 
      component: RegistrationComplete,
      description: 'Finalize registration',
      icon: <CheckCircle className="w-6 h-6" />,
      estimatedTime: '1 min',
      required: false
    }
  ];

  // Enhanced validation functions for each step
  const validateStep = useCallback((stepIndex, data = formData) => {
    const errors = {};
    
    switch (stepIndex) {
      case 0: // Language Preferences
        if (!data.language) errors.language = 'Language selection is required';
        if (!data.theme) errors.theme = 'Theme selection is required';
        break;
        
      case 1: // Company Details
        if (!data.company.name?.trim()) errors.companyName = 'Company name is required';
        if (!data.company.registrationNumber?.trim()) errors.registrationNumber = 'Registration number is required';
        if (!data.company.gstNumber?.trim()) errors.gstNumber = 'GST number is required';
        if (!data.company.panNumber?.trim()) errors.panNumber = 'PAN number is required';
        if (!data.company.email?.trim()) errors.companyEmail = 'Company email is required';
        if (!data.company.phone?.trim()) errors.companyPhone = 'Company phone is required';
        if (!data.company.address?.trim()) errors.companyAddress = 'Company address is required';
        if (!data.company.city?.trim()) errors.companyCity = 'Company city is required';
        if (!data.company.state?.trim()) errors.companyState = 'Company state is required';
        if (!data.company.pincode?.trim()) errors.companyPincode = 'Company pincode is required';
        break;
        
      case 2: // Owner Details
        if (!data.owner.firstName?.trim()) errors.firstName = 'First name is required';
        if (!data.owner.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!data.owner.email?.trim()) errors.ownerEmail = 'Email is required';
        if (!data.owner.phone?.trim()) errors.ownerPhone = 'Phone number is required';
        if (!data.owner.phoneVerified) errors.phoneVerified = 'Phone verification is required';
        if (!data.owner.username?.trim()) errors.username = 'Username is required';
        if (!data.owner.password?.trim()) errors.password = 'Password is required';
        if (!data.owner.aadhaarNumber?.trim()) errors.aadhaarNumber = 'Aadhaar number is required';
        if (!data.owner.panNumber?.trim()) errors.ownerPanNumber = 'PAN number is required';
        if (!data.owner.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!data.owner.gender?.trim()) errors.gender = 'Gender is required';
        if (!data.owner.address?.trim()) errors.ownerAddress = 'Address is required';
        if (!data.owner.city?.trim()) errors.ownerCity = 'City is required';
        if (!data.owner.state?.trim()) errors.ownerState = 'State is required';
        if (!data.owner.pincode?.trim()) errors.ownerPincode = 'Pincode is required';
        break;
        
      case 3: // Industry Category
        if (!data.industry?.trim()) errors.industry = 'Industry selection is required';
        if (!data.category?.trim()) errors.category = 'Category selection is required';
        break;
        
      case 4: // Branch Details (optional)
      case 5: // Staff Details (optional)
      case 6: // Registration Complete
        // No mandatory validations for optional steps
        break;
        
      default:
        break;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [formData]);

  // Get the highest valid step that user can access
  const getHighestAccessibleStep = useCallback((data) => {
    let highestStep = 0;
    
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].required) {
        const validation = validateStep(i, data);
        if (validation.isValid) {
          highestStep = i + 1; // Can access next step
        } else {
          break; // Stop at first invalid required step
        }
      } else {
        // Optional steps - can always access if previous required steps are valid
        highestStep = i + 1;
      }
    }
    
    return Math.min(highestStep, steps.length - 1);
  }, [steps, validateStep]);

  // Enhanced save function with validation
  const saveToLocalStorage = useCallback((step = null, data = null) => {
    try {
      const stepToSave = step !== null ? step : currentStep;
      const dataToSave = data !== null ? data : formData;
      const timestamp = new Date().toISOString();

      // Validate the step before saving
      const highestAccessible = getHighestAccessibleStep(dataToSave);
      const finalStep = Math.min(stepToSave, highestAccessible);

      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, finalStep.toString());
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(dataToSave));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, timestamp);
      
      setLastSaved(timestamp);
      
      console.log('Registration progress saved:', { 
        requestedStep: stepToSave, 
        actualStep: finalStep, 
        highestAccessible,
        timestamp 
      });
    } catch (error) {
      console.error('Failed to save registration progress:', error);
    }
  }, [currentStep, formData, getHighestAccessibleStep]);

  // Enhanced load function with validation
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const savedTimestamp = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);

      if (savedStep && savedData) {
        const requestedStep = parseInt(savedStep, 10);
        const data = JSON.parse(savedData);

        // Validate the restored data and determine the highest accessible step
        const highestAccessible = getHighestAccessibleStep(data);
        const finalStep = Math.min(requestedStep, highestAccessible);

        // Validate step is within bounds
        if (finalStep >= 0 && finalStep < steps.length) {
          setCurrentStep(finalStep);
          setFormData(data);
          setLastSaved(savedTimestamp);
          setIsRestored(true);
          
          console.log('Registration progress restored:', { 
            requestedStep, 
            finalStep, 
            highestAccessible,
            timestamp: savedTimestamp 
          });

          // Show alert if user was moved back due to validation
          if (finalStep < requestedStep) {
            setShowValidationAlert(true);
            setTimeout(() => setShowValidationAlert(false), 5000);
          }
          
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load registration progress:', error);
    }
    return false;
  }, [getHighestAccessibleStep, steps.length]);

  // Check if current step is valid
  const canProceed = useCallback(() => {
    const validation = validateStep(currentStep, formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [currentStep, formData, validateStep]);

  // Clear localStorage
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
      setLastSaved(null);
      setIsRestored(false);
      setValidationErrors({});
      setShowValidationAlert(false);
      console.log('Registration progress cleared');
    } catch (error) {
      console.error('Failed to clear registration progress:', error);
    }
  }, []);

  // Reset to beginning
  const resetProgress = useCallback(() => {
    setCurrentStep(0);
    setFormData({
      language: 'en',
      theme: 'light',
      company: {
        name: '',
        registrationNumber: '',
        gstNumber: '',
        panNumber: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        description: '',
        logo: '',
        logoFileName: '',
        logoFileSize: '',
        logoUploadedAt: ''
      },
      owner: {
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        phoneVerified: false,
        emailVerified: false,
        username: '',
        password: '',
        aadhaarNumber: '',
        panNumber: '',
        dateOfBirth: '',
        gender: '',
        designation: 'Super Admin',
        department: 'Management',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        emergencyContactName: '',
        emergencyContactPhone: '',
        role: 'super_admin',
        photo: '',
        photoFileName: '',
        photoFileSize: '',
        photoUploadedAt: ''
      },
      industry: '',
      category: '',
      branches: [],
      staff: []
    });
    clearLocalStorage();
  }, [clearLocalStorage]);

  // Initialize component - Load saved data on component mount (only once)
  useEffect(() => {
    if (!hasInitialized) {
      const restored = loadFromLocalStorage();
      if (!restored) {
        // If no saved data, save initial state
        saveToLocalStorage(0, formData);
      }
      setHasInitialized(true);
    }
  }, [hasInitialized, loadFromLocalStorage, saveToLocalStorage, formData]);

  // Auto-save when step changes (but not on initial mount)
  useEffect(() => {
    if (hasInitialized && isRestored) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 500); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, hasInitialized, isRestored, saveToLocalStorage]);

  // Auto-save when form data changes (but not on initial mount)
  useEffect(() => {
    if (hasInitialized && isRestored) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 1000); // Longer debounce for form data

      return () => clearTimeout(timeoutId);
    }
  }, [formData, hasInitialized, isRestored, saveToLocalStorage]);

  const updateFormData = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
    
    // Clear validation errors when data is updated
    setValidationErrors({});
  }, []);

  // Enhanced next step with validation
  const nextStep = useCallback(() => {
    // Validate current step before proceeding
    if (!canProceed()) {
      setShowValidationAlert(true);
      setTimeout(() => setShowValidationAlert(false), 5000);
      return;
    }

    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setValidationErrors({});
    }
  }, [canProceed, currentStep, steps.length]);

  // Enhanced previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setValidationErrors({});
      setShowValidationAlert(false);
    }
  }, [currentStep]);

  // Direct step navigation with validation
  const goToStep = useCallback((stepIndex) => {
    const highestAccessible = getHighestAccessibleStep(formData);
    
    if (stepIndex <= highestAccessible) {
      setCurrentStep(stepIndex);
      setValidationErrors({});
      setShowValidationAlert(false);
    } else {
      setShowValidationAlert(true);
      setTimeout(() => setShowValidationAlert(false), 5000);
    }
  }, [formData, getHighestAccessibleStep]);

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return '';
    }
  }, []);

  // Get validation error messages for current step
  const getCurrentStepErrors = useCallback(() => {
    return Object.values(validationErrors).filter(error => error);
  }, [validationErrors]);

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to <span className="gradient-text bg-gradient-to-r from-blue-600 to-purple-600">MOVESURE</span>
        </h1>
        <p className="text-gray-600 text-lg">Let's set up your business account step by step</p>
        
        {/* Progress Status */}
        {isRestored && lastSaved && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <Save className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Progress restored from {formatTimestamp(lastSaved)}
            </span>
          </div>
        )}
      </div>

      {/* Validation Alert */}
      {showValidationAlert && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Please complete all required fields</span>
          </div>
          {getCurrentStepErrors().length > 0 && (
            <div className="mt-2 space-y-1">
              {getCurrentStepErrors().map((error, index) => (
                <div key={index} className="text-sm text-red-700">• {error}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto-save Status & Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {lastSaved && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto-saved {formatTimestamp(lastSaved)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={resetProgress}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Start over from beginning"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
          <button
            onClick={() => saveToLocalStorage()}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            title="Save current progress"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </button>
        </div>
      </div>

      {/* Enhanced Progress Bar with validation-aware navigation */}
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={steps.length} 
        steps={steps}
        formData={formData}
        onStepClick={goToStep}
        getHighestAccessibleStep={() => getHighestAccessibleStep(formData)}
        validationErrors={validationErrors}
      />

      {/* Step Content */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 min-h-[600px] border border-gray-100">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
              {steps[currentStep].icon}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {steps[currentStep].title}
                </h2>
                {steps[currentStep].optional && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Optional
                  </span>
                )}
                {steps[currentStep].required && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Required
                  </span>
                )}
                {isRestored && currentStep > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Restored
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Estimated time</div>
            <div className="text-lg font-semibold text-blue-600">
              {steps[currentStep].estimatedTime}
            </div>
            {currentStep > 0 && (
              <div className="text-xs text-green-600 mt-1">
                Step {currentStep + 1} of {steps.length}
              </div>
            )}
            {!canProceed() && steps[currentStep].required && (
              <div className="text-xs text-red-600 mt-1">
                Required fields missing
              </div>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="animate-fade-in-up">
          <CurrentStepComponent 
            data={formData}
            updateData={updateFormData}
            onLoadingChange={onLoadingChange}
            validationErrors={validationErrors}
          />
        </div>
      </div>

      {/* Enhanced Navigation with validation */}
      <NavigationButtons 
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        formData={formData}
        canProceed={canProceed()}
        steps={steps}
        validationErrors={validationErrors}
        showValidationAlert={showValidationAlert}
      />
    </div>
  );
}