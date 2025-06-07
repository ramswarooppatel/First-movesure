"use client";
import { useState, useEffect } from 'react';
import { User, CheckCircle, X, Loader, AlertCircle } from 'lucide-react';
import { useUsernameVerification } from '@/hooks/useUsernameVerification';

export default function UsernameField({
  value = '',
  onChange,
  onValidationChange,
  required = false,
  disabled = false,
  placeholder = "Enter username",
  firstName = '',
  lastName = ''
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    usernameChecking,
    usernameAvailable,
    usernameError,
    checkUsernameAvailability,
    resetUsernameValidation
  } = useUsernameVerification();

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(usernameAvailable === true && !usernameError);
    }
  }, [usernameAvailable, usernameError, onValidationChange]);

  const handleInputChange = (newValue) => {
    const cleanValue = newValue.toLowerCase().replace(/[^a-z0-9_]/g, '');
    onChange(cleanValue);
    
    if (usernameAvailable !== null || usernameError) {
      resetUsernameValidation();
    }
  };

  const handleBlur = () => {
    if (value && value.length >= 3) {
      checkUsernameAvailability(value);
    }
    setShowSuggestions(false);
  };

  const generateSuggestions = () => {
    if (!firstName || !lastName) return [];
    
    const base = `${firstName}${lastName}`.toLowerCase();
    const suggestions = [
      base,
      `${base}${Math.floor(Math.random() * 100)}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
      `${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`
    ];
    
    return [...new Set(suggestions)]; // Remove duplicates
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    checkUsernameAvailability(suggestion);
  };

  const suggestions = generateSuggestions();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          <User className="w-4 h-4 mr-1" />
          Username {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {firstName && lastName && !value && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Suggestions
          </button>
        )}
      </div>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={() => {
              if (suggestions.length > 0 && !value) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
              usernameError 
                ? 'border-red-300 focus:ring-red-500' 
                : usernameAvailable === true 
                ? 'border-green-300 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {usernameChecking ? (
              <Loader className="w-5 h-5 text-blue-500 animate-spin" />
            ) : usernameError ? (
              <X className="w-5 h-5 text-red-500" />
            ) : usernameAvailable === true ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 font-medium">Suggested usernames:</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {usernameError && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{usernameError}</span>
        </div>
      )}
      
      {usernameAvailable === true && (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Username is available!</span>
        </div>
      )}

      {/* Username Guidelines */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <div className="font-medium mb-1">Username Guidelines:</div>
        <div className="space-y-1">
          <div>• 3-30 characters long</div>
          <div>• Only lowercase letters, numbers, and underscores</div>
          <div>• Cannot start or end with underscore</div>
          <div>• Must be unique across the platform</div>
        </div>
      </div>
    </div>
  );
}