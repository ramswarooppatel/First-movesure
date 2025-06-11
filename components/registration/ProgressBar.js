export default function ProgressBar({ currentStep, totalSteps, steps, formData }) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getCompletionPercentage = (stepIndex) => {
    if (stepIndex < currentStep) return 100;
    if (stepIndex === currentStep) {
      // Calculate completion based on form data
      const stepData = getStepData(stepIndex);
      const requiredFields = getRequiredFields(stepIndex);
      const completedFields = requiredFields.filter(field => stepData[field]);
      return requiredFields.length > 0 ? (completedFields.length / requiredFields.length) * 100 : 0;
    }
    return 0;
  };

  const getStepData = (stepIndex) => {
    switch (stepIndex) {
      case 0: return { language: formData.language, theme: formData.theme };
      case 1: return formData.company || {};
      case 2: return formData.owner || {};
      case 3: return { industry: formData.industry, category: formData.category };
      case 4: return { branches: formData.branches };
      case 5: return { staff: formData.staff };
      default: return {};
    }
  };

  const getRequiredFields = (stepIndex) => {
    switch (stepIndex) {
      case 0: return ['language', 'theme'];
      case 1: return ['companyName', 'registrationNumber', 'city', 'state'];
      case 2: return ['firstName', 'lastName', 'email', 'mobile', 'username', 'password'];
      case 3: return ['industry', 'category'];
      case 4: return []; // Optional
      case 5: return []; // Optional
      default: return [];
    }
  };

  return (
    <div className="mb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{currentStep + 1}</div>
          <div className="text-sm text-gray-600">Current Step</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{totalSteps - currentStep - 1}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const completion = getCompletionPercentage(index);
            
            return (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div className="relative">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-4 relative overflow-hidden ${
                      status === 'completed' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-300 shadow-lg transform scale-110' 
                        : status === 'active'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-300 shadow-lg animate-pulse'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <span className="text-lg">✓</span>
                    ) : status === 'active' ? (
                      <span className="text-lg">{index + 1}</span>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                    
                    {/* Completion Ring */}
                    {status === 'active' && completion > 0 && (
                      <svg className="absolute inset-0 w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-yellow-400"
                          strokeDasharray={`${(completion / 100) * 125.6} 125.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  
                  {/* Step Status Badge */}
                  {status === 'active' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-yellow-900 font-bold">!</span>
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-24">
                  <p className={`text-xs font-semibold leading-tight ${
                    status === 'completed' ? 'text-green-600' 
                    : status === 'active' ? 'text-blue-600' 
                    : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  
                  {/* Completion Percentage */}
                  {status === 'active' && completion > 0 && completion < 100 && (
                    <div className="mt-1">
                      <div className="text-xs text-blue-600 font-medium">{Math.round(completion)}%</div>
                    </div>
                  )}
                  
                  {/* Status Icons */}
                  <div className="mt-1">
                    {status === 'completed' && (
                      <div className="flex justify-center">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                      </div>
                    )}
                    {status === 'active' && (
                      <div className="flex justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Progress Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">{currentStep + 1}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{steps[currentStep]?.title}</h4>
              <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${getCompletionPercentage(currentStep)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(getCompletionPercentage(currentStep))}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Estimated time remaining: {Math.max(0, (totalSteps - currentStep - 1) * 2)} minutes
        </p>
      </div>
    </div>
  );
}