"use client";
import { useState, useRef, useEffect } from 'react';
import { X, Mail, Phone, Shield, RotateCcw } from 'lucide-react';

export default function OTPModal({
  isOpen = false,
  onClose,
  onVerify,
  onResend,
  title = "OTP Verification",
  description = "Please enter the verification code sent to your device",
  otpLength = 6,
  type = "numeric", // "numeric" or "alphanumeric"
  autoFocus = true,
  showGeneratedOTP = false, // For demo purposes
  generatedOTP = "",
  icon = "shield", // "mail", "phone", "shield"
  contactInfo = "", // Email or phone number to display
  resendTimeout = 30, // Seconds before resend is available
  isVerifying = false,
  error = null
}) {
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [timeLeft, setTimeLeft] = useState(resendTimeout);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Handle countdown timer
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [isOpen, timeLeft]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen && autoFocus) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, autoFocus]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset OTP when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(otpLength).fill(''));
      setTimeLeft(resendTimeout);
      setCanResend(false);
    }
  }, [isOpen, otpLength, resendTimeout]);

  const handleInputChange = (index, value) => {
    // Handle paste
    if (value.length > 1) {
      const pastedData = value.slice(0, otpLength);
      const newOtp = [...otp];
      
      for (let i = 0; i < pastedData.length && index + i < otpLength; i++) {
        if (type === "numeric" && !/^\d$/.test(pastedData[i])) continue;
        if (type === "alphanumeric" && !/^[A-Za-z0-9]$/.test(pastedData[i])) continue;
        newOtp[index + i] = pastedData[i].toUpperCase();
      }
      
      setOtp(newOtp);
      
      // Focus on the last filled input or next empty one
      const nextIndex = Math.min(index + pastedData.length, otpLength - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    if (value) {
      if (type === "numeric" && !/^\d$/.test(value)) return;
      if (type === "alphanumeric" && !/^[A-Za-z0-9]$/.test(value)) return;
      
      const newOtp = [...otp];
      newOtp[index] = value.toUpperCase();
      setOtp(newOtp);

      // Auto-focus next input
      if (index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < otpLength - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
    
    // Handle Enter key
    else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === otpLength) {
      onVerify(otpString);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimeLeft(resendTimeout);
      setCanResend(false);
      setOtp(Array(otpLength).fill(''));
      onResend();
      inputRefs.current[0]?.focus();
    }
  };

  const getIcon = () => {
    switch (icon) {
      case "mail":
        return <Mail className="w-10 h-10 text-white" />;
      case "phone":
        return <Phone className="w-10 h-10 text-white" />;
      default:
        return <Shield className="w-10 h-10 text-white" />;
    }
  };

  const getIconGradient = () => {
    switch (icon) {
      case "mail":
        return "from-blue-500 to-indigo-600";
      case "phone":
        return "from-green-500 to-emerald-600";
      default:
        return "from-purple-500 to-indigo-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-white/20 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Icon and Description */}
        <div className="mb-6">
          <div className={`w-20 h-20 bg-gradient-to-r ${getIconGradient()} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {getIcon()}
          </div>
          <p className="text-gray-600 mb-2">{description}</p>
          {contactInfo && (
            <p className="text-sm text-gray-500 font-medium">{contactInfo}</p>
          )}
          
          {/* Show generated OTP for demo */}
          {showGeneratedOTP && generatedOTP && (
            <div className="bg-gray-100 rounded-xl p-4 mt-4 mb-4">
              <p className="text-lg font-mono font-bold text-gray-900">
                Your OTP: {generatedOTP}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                (This is shown for demo purposes)
              </p>
            </div>
          )}
        </div>
        
        {/* OTP Input */}
        <div className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={otpLength}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-lg font-mono border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                } ${digit ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                disabled={isVerifying}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isVerifying}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={otp.join('').length !== otpLength || isVerifying}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 font-medium"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            
            {/* Resend Button */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={handleResend}
                disabled={!canResend || isVerifying}
                className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                  canResend && !isVerifying
                    ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {canResend ? 'Resend OTP' : `Resend in ${timeLeft}s`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2 font-medium">Tips:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• You can paste your OTP directly</div>
            <div>• Use arrow keys to navigate between boxes</div>
            <div>• Press Enter to verify</div>
            {type === "alphanumeric" && <div>• Letters and numbers are allowed</div>}
          </div>
        </div>
      </div>
    </div>
  );
}