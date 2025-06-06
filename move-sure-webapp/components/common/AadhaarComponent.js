"use client";
import { useRef, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { useAadhaarValidation } from '@/hooks/useAadhaarValidation';

export default function AadhaarComponent({
  value = '',
  onChange,
  onVerificationSuccess,
  title = "Aadhaar Verification",
  backgroundColor = "bg-orange-50",
  borderColor = "border-orange-200",
  iconColor = "bg-orange-500",
  titleColor = "text-orange-900",
  required = false,
  disabled = false,
  placeholder = "1234 5678 9012"
}) {
  const aadhaarRefs = useRef([]);
  const {
    aadhaarVerifying,
    aadhaarVerified,
    aadhaarError,
    validateAadhaar,
    maskAadhaar,
    formatAadhaar,
    verifyAadhaar,
    resetAadhaarValidation
  } = useAadhaarValidation();

  // Reset validation when value changes
  useEffect(() => {
    if (value !== value) {
      resetAadhaarValidation();
    }
  }, [value]);

  // Prepare Aadhaar array (12 digits)
  const aadhaarArray = (value || '').replace(/\D/g, '').split('').slice(0, 12);
  while (aadhaarArray.length < 12) aadhaarArray.push('');

  const handleAadhaarChange = (index, inputValue) => {
    // Handle input
    if (inputValue && /^\d$/.test(inputValue)) {
      aadhaarArray[index] = inputValue;
      const newAadhaar = aadhaarArray.join('');
      onChange(newAadhaar);
      
      // Auto-focus next input
      if (index < 11) {
        setTimeout(() => {
          aadhaarRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handleAadhaarKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (aadhaarArray[index]) {
        // Clear current box
        aadhaarArray[index] = '';
        const newAadhaar = aadhaarArray.join('');
        onChange(newAadhaar);
      } else if (index > 0) {
        // Move to previous box and clear it
        aadhaarArray[index - 1] = '';
        const newAadhaar = aadhaarArray.join('');
        onChange(newAadhaar);
        setTimeout(() => {
          aadhaarRefs.current[index - 1]?.focus();
        }, 0);
      }
    }
    
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      aadhaarRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 11) {
      e.preventDefault();
      aadhaarRefs.current[index + 1]?.focus();
    }
    
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 12);
        if (digits.length > 0) {
          onChange(digits);
          // Focus on the last filled digit or next empty one
          const focusIndex = Math.min(digits.length - 1, 11);
          setTimeout(() => {
            aadhaarRefs.current[focusIndex]?.focus();
          }, 0);
        }
      });
    }
    
    // Only allow digits
    else if (!/^\d$/.test(e.key) && !['Tab', 'Enter', 'Delete'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleAadhaarPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 12);
    if (digits.length > 0) {
      onChange(digits);
      // Focus on the last filled digit or next empty one
      const focusIndex = Math.min(digits.length - 1, 11);
      setTimeout(() => {
        aadhaarRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const handleVerify = async () => {
    const success = await verifyAadhaar(value, (data) => {
      if (onVerificationSuccess) {
        onVerificationSuccess(data);
      }
    });
  };

  const handleInputChange = (newValue) => {
    onChange(newValue);
    if (aadhaarError) {
      resetAadhaarValidation();
    }
  };

  // Real-time validation as user types
  const currentError = value && value.replace(/\D/g, '').length === 12 ? validateAadhaar(value) : null;

  return (
    <div className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border ${aadhaarVerified ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
        <div className={`w-8 h-8 ${aadhaarVerified ? 'bg-green-500' : iconColor} rounded-lg flex items-center justify-center mr-3`}>
          {aadhaarVerified ? (
            <CheckCircle className="w-4 h-4 text-white" />
          ) : (
            <CreditCard className="w-4 h-4 text-white" />
          )}
        </div>
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Aadhaar Number {required && <span className="text-red-500">*</span>}
            </label>
            {aadhaarVerified && (
              <div className="flex items-center text-green-600 animate-fade-in-up">
                <span className="text-sm font-medium mr-2">Verified</span>
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>
          
          {/* Aadhaar Input Boxes */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {/* First 4 digits */}
              <div className="flex space-x-1">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (aadhaarRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={aadhaarArray[index] || ''}
                    onChange={(e) => handleAadhaarChange(index, e.target.value)}
                    onKeyDown={(e) => handleAadhaarKeyDown(index, e)}
                    onPaste={handleAadhaarPaste}
                    disabled={disabled || aadhaarVerified}
                    className={`w-12 h-12 text-center text-lg font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      currentError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {/* Separator */}
              <div className="flex items-center">
                <span className="text-gray-400 font-mono text-lg">-</span>
              </div>
              
              {/* Next 4 digits */}
              <div className="flex space-x-1">
                {[4, 5, 6, 7].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (aadhaarRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={aadhaarArray[index] || ''}
                    onChange={(e) => handleAadhaarChange(index, e.target.value)}
                    onKeyDown={(e) => handleAadhaarKeyDown(index, e)}
                    onPaste={handleAadhaarPaste}
                    disabled={disabled || aadhaarVerified}
                    className={`w-12 h-12 text-center text-lg font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      currentError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {/* Separator */}
              <div className="flex items-center">
                <span className="text-gray-400 font-mono text-lg">-</span>
              </div>
              
              {/* Last 4 digits */}
              <div className="flex space-x-1">
                {[8, 9, 10, 11].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (aadhaarRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={aadhaarArray[index] || ''}
                    onChange={(e) => handleAadhaarChange(index, e.target.value)}
                    onKeyDown={(e) => handleAadhaarKeyDown(index, e)}
                    onPaste={handleAadhaarPaste}
                    disabled={disabled || aadhaarVerified}
                    className={`w-12 h-12 text-center text-lg font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      currentError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {(currentError || aadhaarError) && (
              <div className="flex items-center justify-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{currentError || aadhaarError}</span>
              </div>
            )}

            {/* Success Message */}
            {aadhaarVerified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in-up">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Aadhaar Successfully Verified</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your Aadhaar number has been verified and is ready to use.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verify Button */}
            {!aadhaarVerified && value && value.replace(/\D/g, '').length === 12 && !currentError && (
              <div className="flex justify-center">
                <button
                  onClick={handleVerify}
                  disabled={aadhaarVerifying || disabled}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>
                    {aadhaarVerifying ? 'Verifying...' : 'Verify Aadhaar'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {value && value.replace(/\D/g, '').length === 12 && !currentError && !aadhaarError && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Aadhaar Information</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Format:</span>
                <span className="ml-2 font-medium">{formatAadhaar(value)}</span>
              </div>
              {aadhaarVerified && (
                <div>
                  <span className="text-gray-500">Masked Number:</span>
                  <span className="ml-2 font-medium">{maskAadhaar(value)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 font-medium ${aadhaarVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {aadhaarVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Aadhaar Guidelines */}
        {!aadhaarVerified && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Aadhaar Guidelines</h4>
            <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
              <div>• Enter your 12-digit Aadhaar number without spaces</div>
              <div>• You can paste your full Aadhaar number</div>
              <div>• Use arrow keys to navigate between boxes</div>
              <div>• Your Aadhaar data is encrypted and secure</div>
              <div>• Verification is done through UIDAI</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}