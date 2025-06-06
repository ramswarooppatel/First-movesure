import { useState } from 'react';

export const useGSTValidation = () => {
  const [gstVerifying, setGstVerifying] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [gstError, setGstError] = useState(null);

  const validateGSTIN = (gstin) => {
    if (!gstin) return "GST Number is required";
    
    // Remove spaces and convert to uppercase
    const cleanGSTIN = gstin.replace(/\s/g, '').toUpperCase();
    
    // Check length
    if (cleanGSTIN.length !== 15) {
      return "GSTIN must be exactly 15 characters";
    }
    
    // Validate format: 22AAAAA0000A1Z5
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9-A-Z]{1}$/;
    
    if (!gstinRegex.test(cleanGSTIN)) {
      return "Invalid GSTIN format";
    }
    
    // Validate state code (01-37, 97)
    const stateCode = parseInt(cleanGSTIN.substring(0, 2));
    const validStateCodes = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 97
    ];
    
    if (!validStateCodes.includes(stateCode)) {
      return "Invalid state code in GSTIN";
    }
    
    return null; // Valid GSTIN
  };

  const getStateFromGSTCode = (code) => {
    const stateCodeMap = {
      '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
      '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana',
      '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
      '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
      '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram',
      '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam',
      '19': 'West Bengal', '20': 'Jharkhand', '21': 'Odisha',
      '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
      '25': 'Daman and Diu', '26': 'Dadra and Nagar Haveli', '27': 'Maharashtra',
      '28': 'Andhra Pradesh', '29': 'Karnataka', '30': 'Goa',
      '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu',
      '34': 'Puducherry', '35': 'Andaman and Nicobar Islands', '36': 'Telangana',
      '37': 'Andhra Pradesh'
    };
    return stateCodeMap[code] || null;
  };

  const extractPANFromGST = (gstin) => {
    if (!gstin || gstin.length < 12) return null;
    return gstin.substring(2, 12);
  };

  const verifyGST = async (gstNumber, onSuccess) => {
    if (!gstNumber) return;
    
    const validation = validateGSTIN(gstNumber);
    if (validation) {
      setGstError(validation);
      return false;
    }

    setGstError(null);
    setGstVerifying(true);
    
    try {
      // Simulate GST verification API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGstVerified(true);
      setGstVerifying(false);
      
      // Extract data from GST
      const panFromGST = extractPANFromGST(gstNumber);
      const stateCode = gstNumber.substring(0, 2);
      const stateFromGST = getStateFromGSTCode(stateCode);
      
      // Call success callback with extracted data
      if (onSuccess) {
        onSuccess({
          panNumber: panFromGST,
          state: stateFromGST,
          companyName: 'Verified Company Name Pvt Ltd' // This would come from API
        });
      }
      
      return true;
    } catch (error) {
      setGstError('Failed to verify GST. Please try again.');
      setGstVerifying(false);
      return false;
    }
  };

  const resetGSTValidation = () => {
    setGstVerifying(false);
    setGstVerified(false);
    setGstError(null);
  };

  return {
    gstVerifying,
    gstVerified,
    gstError,
    validateGSTIN,
    verifyGST,
    resetGSTValidation,
    getStateFromGSTCode,
    extractPANFromGST
  };
};