"use client";
import { useState, useEffect } from 'react';
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
  Save
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
      estimatedTime: '1 min'
    },
    { 
      title: 'Company Info', 
      component: CompanyDetails,
      description: 'Business registration details',
      icon: <Building2 className="w-6 h-6" />,
      estimatedTime: '3 min'
    },
    { 
      title: 'Admin Details', 
      component: OwnerDetails,
      description: 'Super admin account setup',
      icon: <User className="w-6 h-6" />,
      estimatedTime: '2 min'
    },
    { 
      title: 'Business Category', 
      component: IndustryCategory,
      description: 'Industry and business type',
      icon: <Factory className="w-6 h-6" />,
      estimatedTime: '1 min'
    },
    { 
      title: 'Branch Setup', 
      component: BranchDetails,
      description: 'Configure business locations',
      icon: <MapPin className="w-6 h-6" />,
      estimatedTime: '2 min',
      optional: true
    },
    { 
      title: 'Team Setup', 
      component: StaffDetails,
      description: 'Add staff members',
      icon: <Users className="w-6 h-6" />,
      estimatedTime: '3 min',
      optional: true
    },
    { 
      title: 'Complete', 
      component: RegistrationComplete,
      description: 'Finalize registration',
      icon: <CheckCircle className="w-6 h-6" />,
      estimatedTime: '1 min'
    }
  ];

  // Save to localStorage
  const saveToLocalStorage = (step = null, data = null) => {
    try {
      const stepToSave = step !== null ? step : currentStep;
      const dataToSave = data !== null ? data : formData;
      const timestamp = new Date().toISOString();

      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, stepToSave.toString());
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(dataToSave));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, timestamp);
      
      setLastSaved(timestamp);
      
      console.log('Registration progress saved:', { step: stepToSave, timestamp });
    } catch (error) {
      console.error('Failed to save registration progress:', error);
    }
  };

  // Load from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const savedTimestamp = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);

      if (savedStep && savedData) {
        const step = parseInt(savedStep, 10);
        const data = JSON.parse(savedData);

        // Validate step is within bounds
        if (step >= 0 && step < steps.length) {
          setCurrentStep(step);
          setFormData(data);
          setLastSaved(savedTimestamp);
          setIsRestored(true);
          
          console.log('Registration progress restored:', { step, timestamp: savedTimestamp });
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load registration progress:', error);
    }
    return false;
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
      setLastSaved(null);
      setIsRestored(false);
      console.log('Registration progress cleared');
    } catch (error) {
      console.error('Failed to clear registration progress:', error);
    }
  };

  // Reset to beginning
  const resetProgress = () => {
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
  };

  // Load saved data on component mount
  useEffect(() => {
    const restored = loadFromLocalStorage();
    if (!restored) {
      // If no saved data, save initial state
      saveToLocalStorage(0, formData);
    }
  }, []);

  // Auto-save when step or data changes
  useEffect(() => {
    // Don't save on initial mount, only on actual changes
    if (isRestored || currentStep > 0) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 500); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, formData, isRestored]);

  const updateFormData = (section, data) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [section]: data
      };
      
      // Auto-save after updating form data
      setTimeout(() => saveToLocalStorage(null, newFormData), 100);
      
      return newFormData;
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveToLocalStorage(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveToLocalStorage(newStep);
    }
  };

  const canProceed = () => {
    // Validation logic for each step
    switch (currentStep) {
      case 0: // Language Preferences
        return formData.language && formData.theme;
      case 1: // Company Details
        return formData.company.name && 
               formData.company.registrationNumber && 
               formData.company.city && 
               formData.company.state;
      case 2: // Owner Details
        return formData.owner.firstName && 
               formData.owner.lastName && 
               formData.owner.email && 
               formData.owner.phone && 
               formData.owner.username && 
               formData.owner.password &&
               formData.owner.phoneVerified;
      case 3: // Industry Category
        return formData.industry && formData.category;
      case 4: // Branch Details (optional)
        return true;
      case 5: // Staff Details (optional)
        return true;
      default:
        return true;
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return '';
    }
  };

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

      {/* Enhanced Progress Bar */}
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={steps.length} 
        steps={steps}
        formData={formData}
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
          </div>
        </div>

        {/* Step Content */}
        <div className="animate-fade-in-up">
          <CurrentStepComponent 
            data={formData}
            updateData={updateFormData}
            onLoadingChange={onLoadingChange}
          />
        </div>
      </div>

      {/* Navigation */}
      <NavigationButtons 
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        formData={formData}
        canProceed={canProceed()}
        steps={steps}
      />
    </div>
  );
}