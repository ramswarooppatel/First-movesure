"use client";
import { useEffect, useRef } from 'react';
import { Phone, CheckCircle, AlertCircle } from 'lucide-react';
import InputField from '@/components/common/InputField';
import OTPModal from '@/components/common/OTPModal';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { useOTPModal } from '@/hooks/useOTPModal';

export default function PhoneVerificationComponent({
  value = '',
  onChange,
  onVerificationSuccess,
  title = "Phone Verification",
  backgroundColor = "bg-green-50",
  borderColor = "border-green-200",
  iconColor = "bg-green-500",
  titleColor = "text-green-900",
  required = false,
  disabled = false,
  placeholder = "+91 9876543210"
}) {
  const componentRef = useRef(null);
  const {
    phoneVerifying,
    phoneVerified,
    setPhoneVerified,
    phoneError,
    validatePhone,
    formatPhoneNumber,
    sendOTP: sendPhoneOTP,
    resetPhoneVerification
  } = usePhoneVerification();

  const {
    isModalOpen,
    isVerifying,
    otpError,
    generatedOTP,
    openModal,
    closeModal,
    verifyOTP,
    setOtpError
  } = useOTPModal();

  // Reset verification when phone number changes significantly
  useEffect(() => {
    if (value && phoneVerified) {
      resetPhoneVerification();
    }
  }, [value]);

  const handleSendOTP = async () => {
    const success = await sendPhoneOTP(value, (data) => {
      // Open OTP modal with generated OTP
      openModal(data.otp);
    });
  };

  const handleVerifyOTP = async (enteredOTP) => {
    const success = await verifyOTP(
      enteredOTP,
      generatedOTP,
      (otp) => {
        // Success callback - mark phone as verified
        setPhoneVerified(true);
        
        // Scroll back to the component
        setTimeout(() => {
          componentRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
        
        // Call parent success handler
        if (onVerificationSuccess) {
          onVerificationSuccess({
            phoneNumber: value,
            verified: true,
            verifiedAt: new Date().toISOString()
          });
        }
      },
      (error) => {
        // Error callback
        setOtpError(error);
      }
    );
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  const handleInputChange = (newValue) => {
    onChange(newValue);
    if (phoneError) {
      resetPhoneVerification();
    }
  };

  return (
    <>
      {/* OTP Modal */}
      <OTPModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        title="Mobile Verification"
        description="Please enter the 6-digit verification code sent to your mobile number"
        contactInfo={formatPhoneNumber(value)}
        icon="phone"
        otpLength={6}
        type="numeric"
        showGeneratedOTP={true}
        generatedOTP={generatedOTP}
        isVerifying={isVerifying}
        error={otpError}
        resendTimeout={30}
      />

      <div 
        ref={componentRef}
        className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border ${phoneVerified ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}
      >
        <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
          <div className={`w-8 h-8 ${phoneVerified ? 'bg-green-500' : iconColor} rounded-lg flex items-center justify-center mr-3`}>
            {phoneVerified ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <Phone className="w-4 h-4 text-white" />
            )}
          </div>
          {title}
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number {required && <span className="text-red-500">*</span>}
              </label>
              {phoneVerified && (
                <div className="flex items-center text-green-600 animate-fade-in-up">
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
                  error={phoneError}
                  required={required}
                  disabled={disabled || phoneVerified}
                />
                {phoneError && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{phoneError}</span>
                  </div>
                )}
              </div>
              {!phoneVerified && (
                <button
                  onClick={handleSendOTP}
                  disabled={!value || phoneVerifying || disabled}
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" />
                  <span>
                    {phoneVerifying ? 'Sending...' : 'Send OTP'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Phone Verification Success Status */}
          {phoneVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in-up">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Mobile Number Successfully Verified</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your mobile number has been confirmed and is ready to use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phone Format Helper */}
          {!phoneVerified && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Supported Formats</h4>
              <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                <div>• +91 98765 43210</div>
                <div>• 9876543210</div>
                <div>• 09876543210</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}