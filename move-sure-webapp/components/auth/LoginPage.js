"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Phone, User, Lock, Loader, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('username');

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
      const result = await login(formData.identifier, formData.password);

      if (result.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || authLoading;

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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
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