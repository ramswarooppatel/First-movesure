import { useState } from 'react';

export const usePANValidation = () => {
  const [panVerifying, setPanVerifying] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [panError, setPanError] = useState(null);

  const validatePAN = (pan) => {
    if (!pan) return "PAN Number is required";
    
    // Remove spaces and convert to uppercase
    const cleanPAN = pan.replace(/\s/g, '').toUpperCase();
    
    // Check length
    if (cleanPAN.length !== 10) {
      return "PAN must be exactly 10 characters";
    }
    
    // Validate format: ABCDE1234F
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!panRegex.test(cleanPAN)) {
      return "Invalid PAN format (ABCDE1234F)";
    }
    
    // Validate 4th character (entity type)
    const entityTypes = ['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T'];
    const fourthChar = cleanPAN.charAt(3);
    
    if (!entityTypes.includes(fourthChar)) {
      return "Invalid entity type in PAN";
    }
    
    return null; // Valid PAN
  };

  const getEntityType = (pan) => {
    if (!pan || pan.length < 4) return null;
    
    const entityTypeMap = {
      'P': 'Individual',
      'C': 'Company',
      'H': 'HUF (Hindu Undivided Family)',
      'A': 'Association of Persons',
      'B': 'Body of Individuals',
      'G': 'Government',
      'J': 'Artificial Juridical Person',
      'L': 'Local Authority',
      'F': 'Firm/Partnership',
      'T': 'Trust'
    };
    
    return entityTypeMap[pan.charAt(3)] || 'Unknown';
  };

  const verifyPAN = async (panNumber, onSuccess) => {
    if (!panNumber) return;
    
    const validation = validatePAN(panNumber);
    if (validation) {
      setPanError(validation);
      return false;
    }

    setPanError(null);
    setPanVerifying(true);
    
    try {
      // Simulate PAN verification API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setPanVerified(true);
      setPanVerifying(false);
      
      // Call success callback with extracted data
      if (onSuccess) {
        onSuccess({
          entityType: getEntityType(panNumber),
          holderName: 'Verified PAN Holder Name' // This would come from API
        });
      }
      
      return true;
    } catch (error) {
      setPanError('Failed to verify PAN. Please try again.');
      setPanVerifying(false);
      return false;
    }
  };

  const resetPANValidation = () => {
    setPanVerifying(false);
    setPanVerified(false);
    setPanError(null);
  };

  return {
    panVerifying,
    panVerified,
    panError,
    validatePAN,
    verifyPAN,
    resetPANValidation,
    getEntityType
  };
};