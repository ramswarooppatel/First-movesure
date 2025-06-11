"use client";
import { useState, useRef, useEffect } from 'react';
import InputField from '@/components/common/InputField';
import { MapPin } from 'lucide-react';

export default function AddressComponent({ 
  data = {}, 
  value = {}, // Add value prop for auto-fill support
  onChange, 
  title = "Address Information",
  backgroundColor = "bg-purple-50",
  borderColor = "border-purple-200", 
  iconColor = "bg-purple-500",
  titleColor = "text-purple-900",
  required = false,
  showCountry = true,
  countryValue = "India",
  prefix = "",
  autoFill = false, // New prop to indicate auto-fill mode
  forceUpdate = null // New prop to force updates
}) {
  // Refs for pincode inputs
  const pincodeRefs = useRef([]);
  
  // State to track current address data
  const [currentData, setCurrentData] = useState(data);

  // Auto-fill effect - watch for changes in value prop and update data
  useEffect(() => {
    console.log('AddressComponent: Auto-fill effect triggered', { value, data, autoFill });
    
    // If value prop is provided (for auto-fill), merge it with existing data
    if (value && Object.keys(value).length > 0) {
      const mergedData = {
        ...currentData,
        ...value,
        // Handle multiple address field variations
        address: value.fullAddress || value.address || value.streetAddress || value.addressLine1 || currentData.address || '',
        city: value.city || currentData.city || '',
        state: value.state || currentData.state || '',
        pincode: value.pincode || value.zipCode || value.postalCode || currentData.pincode || '',
        country: value.country || currentData.country || countryValue || 'India'
      };
      
      console.log('AddressComponent: Merged data for auto-fill', mergedData);
      setCurrentData(mergedData);
      
      // Call onChange to sync with parent if this is an auto-fill
      if (autoFill && onChange) {
        onChange(mergedData);
      }
    }
  }, [value, forceUpdate, autoFill]); // Watch value, forceUpdate, and autoFill props

  // Also watch for changes in data prop (original behavior)
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setCurrentData(prev => ({
        ...prev,
        ...data
      }));
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updatedData = { ...currentData, [field]: value };
    
    // If state is changed, reset city and set pincode prefix
    if (field === 'state') {
      updatedData.city = '';
      const statePrefix = getStatePincodePrefix(value);
      if (statePrefix) {
        updatedData.pincode = statePrefix;
      }
    }
    
    setCurrentData(updatedData);
    onChange(updatedData);
  };

  // Advanced pincode input handling
  const handlePincodeChange = (index, value) => {
    const pincodeArray = (currentData.pincode || '').split('').slice(0, 6);
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
    const pincodeArray = (currentData.pincode || '').split('').slice(0, 6);
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

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
    'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 
    'Lakshadweep', 'Andaman and Nicobar Islands'
  ];

  // Cities mapped by state - keeping your existing comprehensive list
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
      'Srinagar', 'Jammu', 'Baramulla', 'Anantnag', 'Sopore', 'Kathua', 
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

  const selectedStateCities = currentData.state ? (citiesByState[currentData.state] || []) : [];
  const pincodeArray = (currentData.pincode || '').split('').slice(0, 6);
  while (pincodeArray.length < 6) pincodeArray.push('');

  return (
    <div className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
        <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center mr-3`}>
          <MapPin className="w-4 h-4 text-white" />
        </div>
        {title}
        {autoFill && (
          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            Auto-filled
          </span>
        )}
      </h3>
      
      {/* Debug info in development mode */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <strong>AddressComponent Debug:</strong>
          <div>Current Data: {JSON.stringify(currentData, null, 2)}</div>
          <div>Value Prop: {JSON.stringify(value, null, 2)}</div>
          <div>Auto-fill: {autoFill ? 'Yes' : 'No'}</div>
        </div>
      )} */}
      
      <div className="space-y-4">
        <InputField
          label={`${prefix ? prefix + ' ' : ''}Address`}
          placeholder={`Enter complete ${prefix ? prefix.toLowerCase() + ' ' : ''}address`}
          value={currentData.address || ''}
          onChange={(value) => handleChange('address', value)}
          required={required}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={currentData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
              required={required}
            >
              <option value="" className="text-gray-500">Select State</option>
              {states.map(state => (
                <option key={state} value={state} className="text-gray-800">{state}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={currentData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800"
              required={required}
              disabled={!currentData.state}
            >
              <option value="" className="text-gray-500">Select City</option>
              {selectedStateCities.map(city => (
                <option key={city} value={city} className="text-gray-800">{city}</option>
              ))}
            </select>
            {!currentData.state && (
              <p className="text-xs text-gray-500 mt-1">Please select a state first</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN Code {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-1 sm:gap-2">
              {pincodeArray.map((digit, index) => (
                <input
                  key={index}
                  ref={el => pincodeRefs.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handlePincodeChange(index, e.target.value)}
                  onKeyDown={(e) => handlePincodeKeyDown(index, e)}
                  onPaste={index === 0 ? handlePincodePaste : undefined}
                  className="w-8 h-10 sm:w-10 sm:h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-800 font-mono text-sm sm:text-lg"
                  maxLength={1}
                  required={required}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use arrow keys to navigate • Paste support • Backspace to clear
            </p>
          </div>
        </div>
        
        {showCountry && (
          <InputField
            label="Country"
            value={currentData.country || countryValue}
            onChange={(value) => handleChange('country', value)}
            disabled
          />
        )}
      </div>
    </div>
  );
}