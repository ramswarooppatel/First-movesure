"use client";
import { useState } from 'react';
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
  Home
} from 'lucide-react';

export default function RegistrationWizard({ onLoadingChange }) {
  const [currentStep, setCurrentStep] = useState(0);
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
      description: ''
    },
    
    // Owner Details (matches users table)
    owner: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      phoneVerified: false,
      username: '',
      password: '',
      aadharNumber: '',
      panNumber: '',
      dateOfBirth: '',
      gender: '',
      designation: 'Super Admin',
      department: 'Management',
      address: '',
      city: '',
      state: '',
      pincode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      role: 'super_admin'
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

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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