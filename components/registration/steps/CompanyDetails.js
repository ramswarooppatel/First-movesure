"use client";
import { useState, useRef } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import AddressComponent from '@/components/common/AddressComponent';
import PhotoUpload from '@/components/common/PhotoUpload';
import { 
  Building2, 
  FileText, 
  MapPin, 
  Edit3, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Loader,
  X,
  Image as ImageIcon
} from 'lucide-react';

export default function CompanyDetails({ data, updateData, onLoadingChange }) {
  const [company, setCompany] = useState(data.company || {});
  const [gstVerifying, setGstVerifying] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationType, setVerificationType] = useState(''); // 'gst' or 'pan'
  
  // Refs for pincode inputs
  const pincodeRefs = useRef([]);

  const handleChange = (field, value) => {
    const updatedCompany = { ...company, [field]: value };
    
    // If state is changed, reset city and set pincode prefix
    if (field === 'state') {
      updatedCompany.city = '';
      const statePrefix = getStatePincodePrefix(value);
      if (statePrefix) {
        updatedCompany.pincode = statePrefix;
      }
    }
    
    setCompany(updatedCompany);
    updateData('company', updatedCompany);
    
    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle company logo change from PhotoUpload component
  const handleLogoChange = (logoData) => {
    if (logoData) {
      // Store the complete logo data
      handleChange('logo', logoData.photo);
      handleChange('logoFileName', logoData.fileName);
      handleChange('logoFileSize', logoData.fileSize);
      handleChange('logoUploadedAt', logoData.uploadedAt);
    } else {
      // Remove logo
      handleChange('logo', '');
      handleChange('logoFileName', '');
      handleChange('logoFileSize', '');
      handleChange('logoUploadedAt', '');
    }
  };

  // Advanced pincode input handling
  const handlePincodeChange = (index, value) => {
    const pincodeArray = (company.pincode || '').split('').slice(0, 6);
    while (pincodeArray.length < 6) pincodeArray.push('');
    
    // Handle input
    if (value && /^\d$/.test(value)) {
      pincodeArray[index] = value;
      const newPincode = pincodeArray.join('');
      handleChange('pincode', newPincode);
      
      // Auto-focus next input
      if (index < 5) {
        setTimeout(() => {
          pincodeRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handlePincodeKeyDown = (index, e) => {
    const pincodeArray = (company.pincode || '').split('').slice(0, 6);
    while (pincodeArray.length < 6) pincodeArray.push('');

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (pincodeArray[index]) {
        // Clear current box
        pincodeArray[index] = '';
        const newPincode = pincodeArray.join('');
        handleChange('pincode', newPincode);
      } else if (index > 0) {
        // Move to previous box and clear it
        pincodeArray[index - 1] = '';
        const newPincode = pincodeArray.join('');
        handleChange('pincode', newPincode);
        setTimeout(() => {
          pincodeRefs.current[index - 1]?.focus();
        }, 0);
      }
    }
    
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      pincodeRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      pincodeRefs.current[index + 1]?.focus();
    }
    
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length > 0) {
          const newPincodeArray = digits.split('');
          while (newPincodeArray.length < 6) newPincodeArray.push('');
          handleChange('pincode', newPincodeArray.join(''));
          
          // Focus on the last filled digit or next empty one
          const focusIndex = Math.min(digits.length, 5);
          setTimeout(() => {
            pincodeRefs.current[focusIndex]?.focus();
          }, 0);
        }
      });
    }
    
    // Only allow digits
    else if (!/^\d$/.test(e.key) && !['Tab', 'Enter', 'Delete'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePincodePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6);
    if (digits.length > 0) {
      handleChange('pincode', digits.padEnd(6, ''));
      // Focus on the last filled digit or next empty one
      const focusIndex = Math.min(digits.length, 5);
      setTimeout(() => {
        pincodeRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  // Get state pincode prefix
  const getStatePincodePrefix = (state) => {
    const statePrefixMap = {
      'Tamil Nadu': '6',
      'Maharashtra': '4',
      'Karnataka': '5',
      'Gujarat': '3',
      'Rajasthan': '3',
      'Uttar Pradesh': '2',
      'West Bengal': '7',
      'Punjab': '1',
      'Haryana': '1',
      'Madhya Pradesh': '4',
      'Bihar': '8',
      'Odisha': '7',
      'Kerala': '6',
      'Assam': '7',
      'Jharkhand': '8',
      'Andhra Pradesh': '5',
      'Telangana': '5',
      'Chhattisgarh': '4',
      'Delhi': '1',
      'Himachal Pradesh': '1',
      'Uttarakhand': '2',
      'Goa': '4'
    };
    return statePrefixMap[state] || '';
  };

  // GST Number Validation
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
    
    // Extract and validate PAN from GSTIN (positions 2-12)
    const panFromGSTIN = cleanGSTIN.substring(2, 12);
    const panValidation = validatePAN(panFromGSTIN);
    
    if (panValidation && panValidation !== "PAN Number is required") {
      return `Invalid PAN in GSTIN: ${panValidation}`;
    }
    
    return null; // Valid GSTIN
  };

  // PAN Number Validation
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

  const verifyGST = async () => {
    if (!company.gstNumber) return;
    
    const gstValidation = validateGSTIN(company.gstNumber);
    if (gstValidation) {
      setValidationErrors(prev => ({ ...prev, gstNumber: gstValidation }));
      return;
    }
    
    setVerificationType('gst');
    setShowVerificationModal(true);
    setGstVerifying(true);
    
    // Simulate GST verification API call
    setTimeout(() => {
      setGstVerified(true);
      setGstVerifying(false);
      setShowVerificationModal(false);
      
      // Extract PAN from GSTIN and auto-fill
      const panFromGST = company.gstNumber.substring(2, 12);
      
      // Auto-fill company details from GST data
      handleChange('name', company.name || 'Verified Company Name Pvt Ltd');
      handleChange('panNumber', company.panNumber || panFromGST);
      
      // Auto-fill state based on GST state code
      const stateCode = company.gstNumber.substring(0, 2);
      const stateFromGST = getStateFromCode(stateCode);
      if (stateFromGST) {
        handleChange('state', stateFromGST);
      }
      
      handleChange('address', company.address );
    }, 3000);
  };

  const verifyPAN = async () => {
    if (!company.panNumber) return;
    
    const panValidation = validatePAN(company.panNumber);
    if (panValidation) {
      setValidationErrors(prev => ({ ...prev, panNumber: panValidation }));
      return;
    }
    
    setVerificationType('pan');
    setShowVerificationModal(true);
    setPanVerifying(true);
    
    // Simulate PAN verification API call
    setTimeout(() => {
      setPanVerified(true);
      setPanVerifying(false);
      setShowVerificationModal(false);
    }, 2500);
  };

  // Function to get state from GST code
  const getStateFromCode = (code) => {
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

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
    'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 
    'Lakshadweep', 'Andaman and Nicobar Islands'
  ];

// Cities mapped by state - Comprehensive list with 20+ cities per state
const citiesByState = {
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 
    'Tirupati', 'Kakinada', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole', 
    'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Chittoor', 'Hindupur', 
    'Proddatur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 
    'Gudivada', 'Narasaraopet', 'Tadipatri', 'Mangalagiri', 'Chilakaluripet'
  ],
  'Arunachal Pradesh': [
    'Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Bomdila', 'Ziro', 'Along', 
    'Basar', 'Daporijo', 'Yingkiong', 'Changlang', 'Tezu', 'Khonsa', 'Namsai', 
    'Roing', 'Anini', 'Tawang', 'Seppa', 'Koloriang', 'Hayuliang', 'Longding', 
    'Aalo', 'Mechuka', 'Sagalee', 'Banderdewa', 'Jairampur', 'Miao', 'Wakro'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 
    'Bongaigaon', 'Dhubri', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara', 
    'Barpeta', 'Mangaldoi', 'Hailakandi', 'Haflong', 'Diphu', 'Golaghat', 'Morigaon', 
    'Nalbari', 'Rangia', 'Margherita', 'Makum', 'Sibsagar', 'Digboi', 'Duliajan', 'Namrup'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 
    'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa', 
    'Sasaram', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 
    'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad', 'Lakhisarai', 'Sheikhpura'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 
    'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri', 'Dalli-Rajhara', 
    'Naila Janjgir', 'Tilda Newra', 'Mungeli', 'Manendragarh', 'Sakti', 'Kawardha', 
    'Ratanpur', 'Takhatpur', 'Dongargaon', 'Champa', 'Akaltara', 'Bhatapara', 
    'Katghora', 'Pendra', 'Baikunthpur'
  ],
  'Goa': [
    'Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 
    'Sanquelim', 'Cuncolim', 'Quepem', 'Cansaulim', 'Aldona', 'Anjuna', 'Arambol', 
    'Assagao', 'Benaulim', 'Calangute', 'Candolim', 'Chapora', 'Colva', 'Cortalim', 
    'Cavelossim', 'Dona Paula', 'Mollem', 'Morjim', 'Pernem', 'Palolem', 'Reis Magos'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 
    'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Mehsana', 'Bharuch', 'Vapi', 'Veraval', 
    'Godhra', 'Patan', 'Kalol', 'Dahod', 'Botad', 'Amreli', 'Deesa', 'Jetpur', 
    'Palanpur', 'Porbandar', 'Upleta', 'Gondal', 'Sidhpur', 'Wankaner'
  ],
  'Haryana': [
    'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 
    'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 
    'Thanesar', 'Kaithal', 'Rewari', 'Narnaul', 'Pundri', 'Kosli', 'Palwal', 
    'Hansi', 'Mahendragarh', 'Ladwa', 'Sohna', 'Mewat', 'Ratia', 'Rania'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 
    'Paonta Sahib', 'Sundarnagar', 'Chamba', 'Una', 'Kullu', 'Bilaspur', 'Hamirpur', 
    'Kangra', 'Manali', 'Kasauli', 'Dalhousie', 'Keylong', 'Reckong Peo', 'Jogindernagar', 
    'Nurpur', 'Nalagarh', 'Theog', 'Rampur', 'Sarahan', 'Kinnaur', 'Spiti'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 
    'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Chaibasa', 'Gumla', 'Dumka', 
    'Godda', 'Sahebganj', 'Koderma', 'Chatra', 'Lohardaga', 'Simdega', 'Khunti', 
    'Seraikela', 'Pakur', 'Jamtara', 'Latehar', 'Garhwa', 'Palamu', 'Rajmahal'
  ],
  'Karnataka': [
    'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 
    'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 
    'Hassan', 'Gadag-Betigeri', 'Udupi', 'Robertson Pet', 'Bhadravati', 'Chitradurga', 
    'Kolar', 'Mandya', 'Chikmagalur', 'Gangawati', 'Bagalkot', 'Ranebennuru', 
    'Karwar', 'Sirsi', 'Puttur', 'Koppal'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 
    'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod', 'Kottayam', 'Pathanamthitta', 
    'Idukki', 'Wayanad', 'Ernakulam', 'Perinthalmanna', 'Chalakudy', 'Changanassery', 
    'Punalur', 'Nilambur', 'Cherthala', 'Perumbavoor', 'Neyyattinkara', 'Kayamkulam', 
    'Mavoor', 'Muvattupuzha', 'Pala', 'Kodungallur'
  ],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 
    'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 
    'Bhind', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur', 
    'Khargone', 'Neemuch', 'Pithampur', 'Narmadapuram', 'Tikamgarh', 'Shahdol', 
    'Seoni', 'Balaghat'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 
    'Amravati', 'Nanded', 'Sangli', 'Malegaon', 'Jalgaon', 'Akola', 'Latur', 
    'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna', 
    'Ambarnath', 'Bhusawal', 'Panvel', 'Badlapur', 'Beed', 'Gondia', 'Satara', 
    'Barshi', 'Yavatmal', 'Achalpur', 'Osmanabad', 'Nandurbar', 'Wardha', 'Udgir'
  ],
  'Manipur': [
    'Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul', 'Senapati', 
    'Tamenglong', 'Chandel', 'Jiribam', 'Kangpokpi', 'Kakching', 'Wangjing', 
    'Mayang Imphal', 'Yairipok', 'Nambol', 'Moirang', 'Lilong', 'Sugnu', 
    'Moreh', 'Mao', 'Noney', 'Pherzawl', 'Tengnoupal', 'Kamjong', 'Noney', 
    'Sadar Hills', 'Motbung', 'Nungba'
  ],
  'Meghalaya': [
    'Shillong', 'Tura', 'Cherrapunji', 'Jowai', 'Baghmara', 'Williamnagar', 
    'Nongstoin', 'Mawkyrwat', 'Resubelpara', 'Ampati', 'Nongpoh', 'Mairang', 
    'Mawsynram', 'Sohra', 'Dawki', 'Nongthymmai', 'Mawlai', 'Laitumkhrah', 
    'Polo', 'Lachumiere', 'Mawprem', 'Umiam', 'Barapani', 'Byrnihat', 
    'Mendipathar', 'Rongjeng', 'Dalu', 'Phulbari'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 
    'Lawngtlai', 'Saitual', 'Khawzawl', 'Hnahthial', 'Zawlnuam', 'Thenzawl', 
    'Darlawn', 'Tlabung', 'Biate', 'Kawrthah', 'Ngopa', 'Tuipang', 'Sangau', 
    'Zokhawthar', 'Demagiri', 'Khawhai', 'Ratu', 'Tuipang', 'Vaphai', 
    'Bungtlang', 'Kawnpui'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 
    'Kiphire', 'Longleng', 'Peren', 'Mon', 'Chumukedima', 'Pfutsero', 'Jalukie', 
    'Tuli', 'Changtongya', 'Aboi', 'Alongkima', 'Angetyongpang', 'Bhandari', 
    'Chessore', 'Ghaspani', 'Longkhim', 'Meluri', 'Noklak', 'Pungro', 
    'Satakha', 'Shamator'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 
    'Balasore', 'Baripada', 'Bhadrak', 'Jharsuguda', 'Jeypore', 'Barbil', 
    'Khordha', 'Kendujhar', 'Sunabeda', 'Rayagada', 'Balangir', 'Jatani', 
    'Byasanagar', 'Paradip', 'Bhawanipatna', 'Dhenkanal', 'Talcher', 'Sundargarh', 
    'Phulbani', 'Koraput', 'Malkangiri', 'Nabarangpur', 'Nuapada', 'Kalahandi'
  ],
  'Punjab': [
    'Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 
    'Firozpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 
    'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Hoshiarpur', 
    'Kapurthala', 'Faridkot', 'Sunam', 'Sangrur', 'Fazilka', 'Gurdaspur', 
    'Kharar', 'Gobindgarh', 'Mansa', 'Malout', 'Nabha', 'Tarn Taran'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 
    'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Kishangarh', 
    'Baran', 'Dhaulpur', 'Tonk', 'Beawar', 'Hanumangarh', 'Gangapur City', 
    'Banswara', 'Makrana', 'Sujangarh', 'Sardarshahar', 'Ladnu', 'Nokha', 
    'Suratgarh', 'Ratangarh', 'Chittorgarh', 'Jhunjhunu', 'Barmer'
  ],
  'Sikkim': [
    'Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Naya Bazar', 
    'Rangpo', 'Singtam', 'Yuksom', 'Pelling', 'Ravangla', 'Lachung', 'Lachen', 
    'Chungthang', 'Dzongri', 'Tsomgo', 'Nathu La', 'Rumtek', 'Legship', 
    'Dentam', 'Tashiding', 'Rabangla', 'Maenam', 'Rhenock', 'Pakyong', 
    'Ranipool', 'Majitar', 'Kalimpong'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 
    'Tirupur', 'Ranipet', 'Nagercoil', 'Thanjavur', 'Vellore', 'Kancheepuram', 
    'Erode', 'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Sivakasi', 'Pudukkottai', 
    'Neyveli', 'Nagapattinam', 'Viluppuram', 'Tiruchengode', 'Vaniyambadi', 
    'Theni', 'Arakkonam', 'Kumarakoil', 'Kumbakonam', 'Karur', 'Udhagamandalam', 
    'Hosur', 'Palladam', 'Paramakudi'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 
    'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Jagtial', 
    'Mancherial', 'Nirmal', 'Kothagudem', 'Bodhan', 'Sangareddy', 'Metpally', 
    'Zaheerabad', 'Kamareddy', 'Medak', 'Vikarabad', 'Jangaon', 'Mandamarri', 
    'Gadwal', 'Bellampalle', 'Kodad', 'Armoor', 'Banswada', 'Kalwakurthy'
  ],
  'Tripura': [
    'Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia', 'Khowai', 
    'Pratapgarh', 'Ranirbazar', 'Sonamura', 'Kumarghat', 'Ambassa', 'Teliamura', 
    'Jirania', 'Mohanpur', 'Kamalpur', 'Sabroom', 'Ramchandraghat', 'Simna', 
    'Bishalgarh', 'Melaghar', 'Jogendranagar', 'Amarpur', 'Gandacherra', 
    'Kanchanpur', 'Lefunga', 'Manu', 'Panisagar', 'Rajnagar'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 
    'Rishikesh', 'Kotdwar', 'Ramnagar', 'Manglaur', 'Laksar', 'Pauri', 
    'Srinagar', 'Pithoragarh', 'Champawat', 'Almora', 'Bageshwar', 'Nainital', 
    'Mussoorie', 'Tehri', 'Uttarkashi', 'Chamoli', 'Rudraprayag', 'Gopeshwar', 
    'Joshimath', 'Karnprayag', 'Lansdowne', 'Chakrata'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 
    'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 
    'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 
    'Farrukhabad', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 
    'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 
    'Bahraich', 'Modinagar', 'Unnao'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 
    'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 
    'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 
    'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling', 
    'Alipurduar', 'Purulia', 'Jangipur', 'Bolpur', 'Bangaon', 'Cooch Behar', 
    'Tamluk', 'Midnapore'
  ],
  'Delhi': [
    'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 
    'West Delhi', 'North West Delhi', 'North East Delhi', 'South West Delhi', 
    'South East Delhi', 'Shahdara', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 
    'Lajpat Nagar', 'Karol Bagh', 'Connaught Place', 'Chandni Chowk', 'Pahar Ganj', 
    'Laxmi Nagar', 'Preet Vihar', 'Mayur Vihar', 'Vasant Kunj', 'Saket', 
    'Nehru Place', 'Greater Kailash', 'Defence Colony'
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Jammu', 'Baramulla', 'Anantnag', 'Sopore', 'KathuaDistrict', 
    'Udhampur', 'Punch', 'Rajauri', 'Kupwara', 'Budgam', 'Ganderbal', 'Pulwama', 
    'Shopian', 'Kulgam', 'Bandipora', 'Doda', 'Kishtwar', 'Ramban', 'Reasi', 
    'Samba', 'Rajouri', 'Poonch', 'Handwara', 'Tangmarg', 'Gulmarg', 'Pahalgam', 'Sonamarg'
  ],
  'Ladakh': [
    'Leh', 'Kargil', 'Nubra', 'Changthang', 'Zanskar', 'Drass', 'Batalik', 
    'Turtuk', 'Hunder', 'Diskit', 'Panamik', 'Tangtse', 'Durbuk', 'Nyoma', 
    'Hanle', 'Chushul', 'Demchok', 'Tso Moriri', 'Pangong', 'Khardung', 
    'Thiksey', 'Hemis', 'Alchi', 'Likir', 'Lamayuru', 'Mulbekh', 'Rangdum', 'Padum'
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Villianur', 'Ariyankuppam', 
    'Mannadipet', 'Bahour', 'Nettapakkam', 'Kirumampakkam', 'Mudaliarpet', 
    'Thattanchavady', 'Embalam', 'Korkadu', 'Kottakuppam', 'Madagadipet', 
    'Mettupalayam', 'Muthialpet', 'Oulgaret', 'Ozhukarai', 'Reddiarpalayam', 
    'Sedarapet', 'Sulthanpet', 'Uppalam', 'Vadhanur', 'Vaithikuppam', 
    'Villianur', 'Kalapet'
  ],
  'Chandigarh': [
    'Chandigarh', 'Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Sector 15', 
    'Sector 8', 'Sector 9', 'Sector 11', 'Sector 18', 'Sector 19', 'Sector 20', 
    'Sector 21', 'Sector 23', 'Sector 24', 'Sector 26', 'Sector 27', 'Sector 28', 
    'Sector 29', 'Sector 30', 'Sector 31', 'Sector 32', 'Sector 33', 'Sector 34', 
    'Sector 36', 'Sector 37', 'Sector 38', 'Sector 40'
  ],
  'Dadra and Nagar Haveli': [
    'Silvassa', 'Naroli', 'Rakholi', 'Dudhani', 'Masat', 'Khanvel', 'Samarvarni', 
    'Amli', 'Velugam', 'Dahikhed', 'Khadoli', 'Rudana', 'Galonda', 'Bhimpore', 
    'Kilvani', 'Raniamba', 'Mandoni', 'Kherdi', 'Piplod', 'Kunta', 'Vasona', 
    'Dolara', 'Selti', 'Zari', 'Athal', 'Bedpa', 'Chisda', 'Dapada'
  ],
  'Daman and Diu': [
    'Daman', 'Diu', 'Moti Daman', 'Nani Daman', 'Vanakbara', 'Nagoa', 'Ghogla', 
    'Fudam', 'Simbor', 'Pariali', 'Bhimpore', 'Kachigam', 'Kadaiya', 'Magarwada', 
    'Marwad', 'Dabhel', 'Jampore', 'Devka', 'Dunetha', 'Ringangam', 'Lavachha', 
    'Varkund', 'Dholar', 'Bucharwada', 'Bhenslore', 'Kunta', 'Zari', 'Dalwada'
  ],
  'Lakshadweep': [
    'Kavaratti', 'Agatti', 'Minicoy', 'Amini', 'Andrott', 'Kalpeni', 'Kadmat', 
    'Kiltan', 'Chetlat', 'Bitra', 'Bangaram', 'Thinnakara', 'Parali I', 'Parali II', 
    'Suheli Par', 'Cheriyam', 'Valiyaparamba', 'Perumal Par', 'Kalpatti', 
    'Tinakara', 'Suheli', 'Pitti', 'Viringili', 'Tinnakara', 'Bunduram', 
    'Cherbaniani', 'Kodithala', 'Valakkara'
  ],
  'Andaman and Nicobar Islands': [
    'Port Blair', 'Diglipur', 'Rangat', 'Mayabunder', 'Baratang', 'Wandoor', 
    'Bamboo Flat', 'Garacharma', 'Prothrapur', 'Manjeri', 'Pahargaon', 'Nimbudera', 
    'Ferrargunj', 'Little Andaman', 'Campbell Bay', 'Car Nicobar', 'Nancowry', 
    'Katchal', 'Camorta', 'Teressa', 'Chowra', 'Trinket', 'Kondul', 'Great Nicobar', 
    'Hut Bay', 'Malacca', 'Pilomilo', 'Shompen'
  ]
};

  const selectedStateCities = company.state ? (citiesByState[company.state] || []) : [];
  const pincodeArray = (company.pincode || '').split('').slice(0, 6);
  while (pincodeArray.length < 6) pincodeArray.push('');

  // Verification Modal Component
  const VerificationModal = () => (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-white/20">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying {verificationType === 'gst' ? 'GST Number' : 'PAN Number'}
          </h3>
          <p className="text-gray-600">
            Please wait while we verify your {verificationType === 'gst' ? 'GSTIN' : 'PAN'} with government database...
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            {verificationType === 'gst' ? 'Validating GSTIN format and checking with GST network...' : 'Validating PAN format and verifying with Income Tax database...'}
          </p>
        </div>
      </div>
    </div>
  );

  const handleAddressChange = (addressData) => {
    const updatedCompany = { ...company, ...addressData };
    setCompany(updatedCompany);
    updateData('company', updatedCompany);
  };

  return (
    <div className="space-y-8">
      {/* Verification Modal */}
      {showVerificationModal && <VerificationModal />}

      {/* Company Logo Upload */}
      <PhotoUpload
        value={company.logo || ''} // Pass the base64 logo directly
        onChange={handleLogoChange}
        onLoadingChange={onLoadingChange}
        label="Company Logo"
        placeholder="Add Logo"
        maxSize={5}
        outputSize={128}
        previewSize={128}
        required={false}
        backgroundColor="bg-gradient-to-r from-orange-50 to-yellow-50"
        borderColor="border-orange-200"
        iconColor="bg-orange-500"
        buttonColor="bg-orange-600 hover:bg-orange-700"
        autoGenerateFilename={true}
        allowedTypes={['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif']}
      />

      {/* Basic Company Information */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Company Name"
            placeholder="Enter your company name"
            value={company.name || ''}
            onChange={(value) => handleChange('name', value)}
            required
          />
          
          <InputField
            label="Registration Number"
            placeholder="Company registration number"
            value={company.registrationNumber || ''}
            onChange={(value) => handleChange('registrationNumber', value)}
            required
          />
          
          <InputField
            label="Company Email"
            type="email"
            placeholder="company@example.com"
            value={company.email || ''}
            onChange={(value) => handleChange('email', value)}
          />
          
          <InputField
            label="Company Phone"
            placeholder="+91 9876543210"
            value={company.phone || ''}
            onChange={(value) => handleChange('phone', value)}
          />
          
          <div className="md:col-span-2">
            <InputField
              label="Website (Optional)"
              placeholder="https://www.yourcompany.com"
              value={company.website || ''}
              onChange={(value) => handleChange('website', value)}
            />
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Tax Information
        </h3>

        {/* GST Verification */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              GST Number <span className="text-red-500">*</span>
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
                placeholder="22AAAAA0000A1Z5"
                value={company.gstNumber || ''}
                onChange={(value) => handleChange('gstNumber', value.toUpperCase())}
                maxLength={15}
                error={validationErrors.gstNumber}
                required
              />
              {validationErrors.gstNumber && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{validationErrors.gstNumber}</span>
                </div>
              )}
            </div>
            <button
              onClick={verifyGST}
              disabled={!company.gstNumber || gstVerifying || gstVerified}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
            >
              <Shield className="w-4 h-4" />
              <span>{gstVerified ? 'Verified' : 'Verify GST'}</span>
            </button>
          </div>
        </div>

        {/* PAN Verification */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              PAN Number <span className="text-red-500">*</span>
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
                placeholder="ABCDE1234F"
                value={company.panNumber || ''}
                onChange={(value) => handleChange('panNumber', value.toUpperCase())}
                maxLength={10}
                error={validationErrors.panNumber}
                required
              />
              {validationErrors.panNumber && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{validationErrors.panNumber}</span>
                </div>
              )}
            </div>
            <button
              onClick={verifyPAN}
              disabled={!company.panNumber || panVerifying || panVerified}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
            >
              <Shield className="w-4 h-4" />
              <span>{panVerified ? 'Verified' : 'Verify PAN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <AddressComponent
        data={{
          address: company.address,
          city: company.city,
          state: company.state,
          pincode: company.pincode,
          country: company.country
        }}
        onChange={handleAddressChange}
        title="Address Information"
        backgroundColor="bg-purple-50"
        borderColor="border-purple-200"
        iconColor="bg-purple-500"
        titleColor="text-purple-900"
        prefix="Business"
        required={true}
        showCountry={true}
        countryValue="India"
      />

      {/* Company Description */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
            <Edit3 className="w-4 h-4 text-white" />
          </div>
          Company Description (Optional)
        </h3>
        
        <textarea
          placeholder="Brief description of your business, products, or services..."
          value={company.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-h-[100px]"
          maxLength={500}
        />
        <p className="text-xs text-gray-600 mt-2">
          {(company.description || '').length}/500 characters
        </p>
      </div>
    </div>
  );
}