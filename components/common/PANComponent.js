"use client";
import { useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import InputField from '@/components/common/InputField';
import { usePANValidation } from '@/hooks/usePANValidation';

export default function PANComponent({
  value = '',
  onChange,
  onVerificationSuccess,
  title = "PAN Verification",
  backgroundColor = "bg-blue-50",
  borderColor = "border-blue-200",
  iconColor = "bg-blue-500",
  titleColor = "text-blue-900",
  required = false,
  disabled = false,
  placeholder = "ABCDE1234F"
}) {
  const {
    panVerifying,
    panVerified,
    panError,
    validatePAN,
    verifyPAN,
    resetPANValidation,
    getEntityType
  } = usePANValidation();

  // Reset validation when value changes
  useEffect(() => {
    if (value !== value) {
      resetPANValidation();
    }
  }, [value]);

  const handleVerify = async () => {
    const success = await verifyPAN(value, (data) => {
      if (onVerificationSuccess) {
        onVerificationSuccess(data);
      }
    });
  };

  const handleInputChange = (newValue) => {
    onChange(newValue);
    if (panError) {
      resetPANValidation();
    }
  };

  return (
    <div className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
        <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center mr-3`}>
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              PAN Number {required && <span className="text-red-500">*</span>}
            </label>
            {panVerified && (
              <div className="flex items-center text-green-600">
                <span className="text-sm font-medium mr-2">Verified</span>
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <InputField
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                maxLength={10}
                error={panError}
                required={required}
                disabled={disabled || panVerifying}
                className="uppercase"
              />
              {panError && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{panError}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleVerify}
              disabled={!value || panVerifying || panVerified || disabled}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
            >
              <Shield className="w-4 h-4" />
              <span>
                {panVerifying ? 'Verifying...' : panVerified ? 'Verified' : 'Verify PAN'}
              </span>
            </button>
          </div>
        </div>

        {/* Additional Information */}
        {value && !panError && value.length === 10 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">PAN Information</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Entity Type:</span>
                <span className="ml-2 font-medium">{getEntityType(value)}</span>
              </div>
              <div>
                <span className="text-gray-500">Format:</span>
                <span className="ml-2 font-medium">
                  {value.substring(0, 5)} - {value.substring(5, 9)} - {value.substring(9, 10)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}