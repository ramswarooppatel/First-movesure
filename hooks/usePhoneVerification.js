import { useState } from 'react';

export const usePhoneVerification = () => {
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if it starts with +91 or country code
    if (cleanPhone.startsWith('+91')) {
      const number = cleanPhone.substring(3);
      if (number.length !== 10) {
        return "Indian mobile number must be 10 digits after +91";
      }
      if (!/^[6-9][0-9]{9}$/.test(number)) {
        return "Invalid Indian mobile number format";
      }
    } else if (cleanPhone.length === 10) {
      if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
        return "Mobile number must start with 6, 7, 8, or 9";
      }
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      const number = cleanPhone.substring(1);
      if (!/^[6-9][0-9]{9}$/.test(number)) {
        return "Invalid mobile number format";
      }
    } else {
      return "Please enter a valid 10-digit mobile number";
    }
    
    return null; // Valid phone
  };

  const formatPhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (cleanPhone.startsWith('+91')) {
      const number = cleanPhone.substring(3);
      return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
    } else if (cleanPhone.length === 10) {
      return `+91 ${cleanPhone.substring(0, 5)} ${cleanPhone.substring(5)}`;
    }
    
    return phone; // Return as is if format is unclear
  };

  const sendOTP = async (phoneNumber, onSuccess) => {
    if (!phoneNumber) return false;
    
    const validation = validatePhone(phoneNumber);
    if (validation) {
      setPhoneError(validation);
      return false;
    }

    setPhoneError(null);
    setPhoneVerifying(true);
    
    try {
      // Generate a random 6-digit OTP
      const generatedOTPCode = Math.floor(100000 + Math.random() * 900000);
      
      // Simulate OTP sending API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPhoneVerifying(false);
      
      if (onSuccess) {
        onSuccess({
          otp: generatedOTPCode.toString(),
          formattedPhone: formatPhoneNumber(phoneNumber)
        });
      }
      
      return true;
    } catch (error) {
      setPhoneError('Failed to send OTP. Please try again.');
      setPhoneVerifying(false);
      return false;
    }
  };

  const resetPhoneVerification = () => {
    setPhoneVerifying(false);
    setPhoneVerified(false);
    setPhoneError(null);
  };

  return {
    phoneVerifying,
    phoneVerified,
    setPhoneVerified,
    phoneError,
    validatePhone,
    formatPhoneNumber,
    sendOTP,
    resetPhoneVerification
  };
};