import { useState } from 'react';

export const useOTPModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const openModal = (otp = '') => {
    setGeneratedOTP(otp);
    setIsModalOpen(true);
    setOtpError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOtpError(null);
    setIsVerifying(false);
  };

  const verifyOTP = async (enteredOTP, correctOTP, onSuccess, onError) => {
    setIsVerifying(true);
    setOtpError(null);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (enteredOTP === correctOTP) {
        setIsVerifying(false);
        closeModal();
        if (onSuccess) onSuccess(enteredOTP);
        return true;
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setIsVerifying(false);
        if (onError) onError('Invalid OTP');
        return false;
      }
    } catch (error) {
      setOtpError('Verification failed. Please try again.');
      setIsVerifying(false);
      if (onError) onError(error.message);
      return false;
    }
  };

  return {
    isModalOpen,
    isVerifying,
    otpError,
    generatedOTP,
    openModal,
    closeModal,
    verifyOTP,
    setOtpError
  };
};