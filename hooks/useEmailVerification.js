import { useState } from 'react';

export const useEmailVerification = () => {
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "Email address is required";
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    // Check for common email domains
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'live.com', 'icloud.com', 'protonmail.com', 'zoho.com'
    ];
    
    const domain = email.split('@')[1];
    
    // Check for suspicious patterns
    if (domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
      return "Invalid email domain format";
    }
    
    // Check for minimum domain requirements
    if (domain.split('.').length < 2) {
      return "Email domain must have at least one dot";
    }
    
    return null; // Valid email
  };

  const checkEmailAvailability = async (email) => {
    if (!email) return false;
    
    setEmailVerifying(true);
    
    try {
      // Simulate email availability check API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate some emails being taken (for demo)
      const takenEmails = ['admin@example.com', 'test@test.com', 'user@demo.com'];
      
      if (takenEmails.includes(email.toLowerCase())) {
        setEmailError('This email address is already registered');
        setEmailVerifying(false);
        return false;
      }
      
      setEmailError(null);
      setEmailVerifying(false);
      return true;
    } catch (error) {
      setEmailError('Failed to check email availability');
      setEmailVerifying(false);
      return false;
    }
  };

  const sendVerificationOTP = async (email, onSuccess) => {
    if (!email) return false;
    
    const validation = validateEmail(email);
    if (validation) {
      setEmailError(validation);
      return false;
    }

    setEmailVerifying(true);
    
    try {
      // Generate a random 6-digit OTP
      const generatedOTPCode = Math.floor(100000 + Math.random() * 900000);
      
      // Simulate sending OTP via email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationSent(true);
      setEmailVerifying(false);
      setEmailError(null);
      
      if (onSuccess) {
        onSuccess({
          email,
          otp: generatedOTPCode.toString(),
          sentAt: new Date().toISOString()
        });
      }
      
      return true;
    } catch (error) {
      setEmailError('Failed to send verification code. Please try again.');
      setEmailVerifying(false);
      return false;
    }
  };

  const resetEmailVerification = () => {
    setEmailVerifying(false);
    setEmailVerified(false);
    setEmailError(null);
    setVerificationSent(false);
  };

  return {
    emailVerifying,
    emailVerified,
    setEmailVerified,
    emailError,
    verificationSent,
    validateEmail,
    checkEmailAvailability,
    sendVerificationOTP,
    resetEmailVerification
  };
};