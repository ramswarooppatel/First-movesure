"use client";
import { useEffect, useRef } from 'react';
import { Mail, CheckCircle, AlertCircle, Send } from 'lucide-react';
import InputField from '@/components/common/InputField';
import OTPModal from '@/components/common/OTPModal';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useOTPModal } from '@/hooks/useOTPModal';

export default function EmailVerificationComponent({
  value = '',
  onChange,
  onVerificationSuccess,
  title = "Email Verification",
  backgroundColor = "bg-blue-50",
  borderColor = "border-blue-200",
  iconColor = "bg-blue-500",
  titleColor = "text-blue-900",
  required = false,
  disabled = false,
  placeholder = "your.email@example.com",
  checkAvailability = true
}) {
  const componentRef = useRef(null);
  const {
    emailVerifying,
    emailVerified,
    setEmailVerified,
    emailError,
    verificationSent,
    validateEmail,
    checkEmailAvailability,
    sendVerificationOTP,
    resetEmailVerification
  } = useEmailVerification();

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

  // Reset verification when email changes significantly
  useEffect(() => {
    if (value && emailVerified) {
      resetEmailVerification();
    }
  }, [value]);

  const handleSendVerification = async () => {
    const success = await sendVerificationOTP(value, (data) => {
      // Open OTP modal with generated OTP
      openModal(data.otp);
    });
  };

  const handleVerifyOTP = async (enteredOTP) => {
    const success = await verifyOTP(
      enteredOTP,
      generatedOTP,
      (otp) => {
        // Success callback - mark email as verified
        setEmailVerified(true);
        
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
            email: value,
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
    await handleSendVerification();
  };

  const handleCheckAvailability = async () => {
    if (checkAvailability) {
      await checkEmailAvailability(value);
    }
  };

  const handleInputChange = (newValue) => {
    onChange(newValue);
    if (emailError) {
      resetEmailVerification();
    }
  };

  const handleBlur = () => {
    if (value && !emailError && checkAvailability) {
      handleCheckAvailability();
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
        title="Email Verification"
        description="Please enter the 6-digit verification code sent to your email"
        contactInfo={value}
        icon="mail"
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
        className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border ${emailVerified ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}
      >
        <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
          <div className={`w-8 h-8 ${emailVerified ? 'bg-green-500' : iconColor} rounded-lg flex items-center justify-center mr-3`}>
            {emailVerified ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <Mail className="w-4 h-4 text-white" />
            )}
          </div>
          {title}
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Email Address {required && <span className="text-red-500">*</span>}
              </label>
              {emailVerified && (
                <div className="flex items-center text-green-600 animate-fade-in-up">
                  <span className="text-sm font-medium mr-2">Verified</span>
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
              {verificationSent && !emailVerified && (
                <div className="flex items-center text-orange-600">
                  <span className="text-sm font-medium mr-2">OTP Sent</span>
                  <Send className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <div className="flex-1">
                <InputField
                  type="email"
                  placeholder={placeholder}
                  value={value}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={emailError}
                  required={required}
                  disabled={disabled || emailVerified}
                />
                {emailError && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{emailError}</span>
                  </div>
                )}
              </div>
              {!emailVerified && (
                <button
                  onClick={handleSendVerification}
                  disabled={!value || emailVerifying || disabled || emailError}
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {emailVerifying ? 'Sending...' : verificationSent ? 'Resend' : 'Send OTP'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Email Verification Success Status */}
          {emailVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in-up">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Email Successfully Verified</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your email address has been confirmed and is ready to use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Verification Status */}
          {verificationSent && !emailVerified && !isModalOpen && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Send className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Verification Code Sent</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Please check your email for the 6-digit verification code.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Guidelines */}
          {!emailVerified && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Email Guidelines</h4>
              <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                <div>• Use a valid email address you have access to</div>
                <div>• Check spam/junk folder if you don't receive the code</div>
                <div>• Business emails are preferred for company registration</div>
                <div>• Verification code expires in 10 minutes</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}