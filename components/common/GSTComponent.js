"use client";
import { useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import InputField from '@/components/common/InputField';
import { useGSTValidation } from '@/hooks/useGSTValidation';

export default function GSTComponent({
  value = '',
  onChange,
  onVerificationSuccess,
  title = "GST Verification",
  backgroundColor = "bg-green-50",
  borderColor = "border-green-200",
  iconColor = "bg-green-500",
  titleColor = "text-green-900",
  required = false,
  disabled = false,
  placeholder = "22AAAAA0000A1Z5"
}) {
  const {
    gstVerifying,
    gstVerified,
    gstError,
    validateGSTIN,
    verifyGST,
    resetGSTValidation
  } = useGSTValidation();

  // Reset validation when value changes
  useEffect(() => {
    if (value !== value) {
      resetGSTValidation();
    }
  }, [value]);

  const handleVerify = async () => {
    const success = await verifyGST(value, (data) => {
      if (onVerificationSuccess) {
        onVerificationSuccess(data);
      }
    });
  };

  const handleInputChange = (newValue) => {
    onChange(newValue);
    if (gstError) {
      resetGSTValidation();
    }
  };

  return (
    <div className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
        <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center mr-3`}>
          <FileText className="w-4 h-4 text-white" />
        </div>
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              GST Number {required && <span className="text-red-500">*</span>}
            </label>
            {gstVerified && (
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
                maxLength={15}
                error={gstError}
                required={required}
                disabled={disabled || gstVerifying}
                className="uppercase"
              />
              {gstError && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{gstError}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleVerify}
              disabled={!value || gstVerifying || gstVerified || disabled}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
            >
              <Shield className="w-4 h-4" />
              <span>
                {gstVerifying ? 'Verifying...' : gstVerified ? 'Verified' : 'Verify GST'}
              </span>
            </button>
          </div>
        </div>

        {/* Additional Information */}
        {value && !gstError && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">GST Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">State Code:</span>
                <span className="ml-2 font-medium">{value.substring(0, 2)}</span>
              </div>
              <div>
                <span className="text-gray-500">PAN:</span>
                <span className="ml-2 font-medium">{value.substring(2, 12)}</span>
              </div>
              <div>
                <span className="text-gray-500">Entity Code:</span>
                <span className="ml-2 font-medium">{value.substring(12, 13)}</span>
              </div>
              <div>
                <span className="text-gray-500">Check Digit:</span>
                <span className="ml-2 font-medium">{value.substring(14, 15)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}