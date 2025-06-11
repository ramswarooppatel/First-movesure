import { useState, useCallback } from 'react';

export const useUsernameVerification = () => {
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState('');

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-z0-9_]+$/.test(username)) return "Username can only contain lowercase letters, numbers, and underscores";
    if (username.startsWith('_') || username.endsWith('_')) return "Username cannot start or end with underscore";
    if (username.includes('__')) return "Username cannot contain consecutive underscores";
    
    return null;
  };

  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username) {
      setUsernameAvailable(null);
      setUsernameError('');
      return false;
    }

    const validation = validateUsername(username);
    if (validation) {
      setUsernameError(validation);
      setUsernameAvailable(false);
      return false;
    }

    setUsernameChecking(true);
    setUsernameError('');

    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (result.available) {
        setUsernameAvailable(true);
        setUsernameError('');
        return true;
      } else {
        setUsernameAvailable(false);
        setUsernameError(result.message || 'Username not available');
        return false;
      }
    } catch (error) {
      setUsernameError('Error checking username availability');
      setUsernameAvailable(false);
      return false;
    } finally {
      setUsernameChecking(false);
    }
  }, []);

  const resetUsernameValidation = () => {
    setUsernameChecking(false);
    setUsernameAvailable(null);
    setUsernameError('');
  };

  return {
    usernameChecking,
    usernameAvailable,
    usernameError,
    validateUsername,
    checkUsernameAvailability,
    resetUsernameValidation
  };
};