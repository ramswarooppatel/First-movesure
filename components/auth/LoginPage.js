"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthStorage } from '@/utils/authStorage';
import { Eye, EyeOff, Phone, User, Lock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading, isAuthenticated, authInitialized } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('username');
  const [success, setSuccess] = useState(false);

  // Check authentication on mount and handle redirects
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      // Double-check authentication state
      const isUserAuthenticated = isAuthenticated || AuthStorage.isAuthenticated();
      
      if (authInitialized && isUserAuthenticated) {
        console.log('LoginPage: User already authenticated, redirecting to dashboard');
        setSuccess(true);
        
        // Small delay to show success state
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1000);
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, authInitialized, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const detectLoginType = (value) => {
    const isPhone = /^\+?[\d\s\-\(\)]+$/.test(value);
    setLoginType(isPhone ? 'phone' : 'username');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('LoginPage: Attempting login...');
      
      const result = await login(formData.identifier, formData.password);

      if (result.success) {
        console.log('LoginPage: Login successful');
        setSuccess(true);
        
        // Clear form
        setFormData({ identifier: '', password: '' });
        
        // Show success briefly then redirect
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1500);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('LoginPage: Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || authLoading;

  // Show loading while auth is being initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
          <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated || AuthStorage.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Already logged in. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your MOVESURE account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identifier Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                {loginType === 'phone' ? (
                  <Phone className="w-4 h-4 mr-2" />
                ) : (
                  <User className="w-4 h-4 mr-2" />
                )}
                {loginType === 'phone' ? 'Phone Number' : 'Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => {
                    handleInputChange('identifier', e.target.value);
                    detectLoginType(e.target.value);
                  }}
                  placeholder="Enter username or phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={loading}
                  autoComplete="username"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {loginType === 'phone' ? (
                    <Phone className="w-5 h-5 text-gray-400" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {loginType === 'phone' 
                  ? 'Enter your registered phone number'
                  : 'Enter your username'
                }
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading || !formData.identifier || !formData.password}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => router.push('/auth/forgot-password')}
              >
                Forgot your password?
              </button>
            </div>
          </form>

          {/* Additional Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Don't have an account?
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/register')}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Create New Account
              </Button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your login is secured with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
}