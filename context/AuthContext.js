"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthStorage } from '@/utils/authStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle route changes - don't show loader for authenticated users
  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      setLoading(false);
    }
  }, [pathname, authInitialized, isAuthenticated]);

  const initializeAuth = async () => {
    console.log('AuthContext: Initializing authentication...');
    
    try {
      setLoading(true);

      // Generate or get device ID
      const deviceId = AuthStorage.generateDeviceId();
      setDeviceId(deviceId);

      // Check if auth data exists and is valid
      const authData = AuthStorage.getAuthData();
      
      if (authData && !AuthStorage.isAuthDataExpired()) {
        console.log('AuthContext: Found valid auth data in localStorage');
        
        // Restore auth state immediately
        setUser(authData.user);
        setToken(authData.tokens.accessToken);
        setRefreshToken(authData.tokens.refreshToken);
        setSessionToken(authData.tokens.sessionToken);
        setIsAuthenticated(true);
        setLoading(false);

        console.log('AuthContext: Auth state restored successfully');

        // Verify token in background
        setTimeout(() => {
          verifyTokenInBackground(authData.tokens.accessToken, authData.tokens.refreshToken);
        }, 100);

      } else {
        console.log('AuthContext: No valid auth data found');
        setIsAuthenticated(false);
        setLoading(false);
        
        // Clear any corrupted data
        if (authData && AuthStorage.isAuthDataExpired()) {
          AuthStorage.clearAuthData();
        }
      }
    } catch (error) {
      console.error('AuthContext: Auth initialization failed:', error);
      setIsAuthenticated(false);
      setLoading(false);
      AuthStorage.clearAuthData();
    } finally {
      setAuthInitialized(true);
    }
  };

  const verifyTokenInBackground = async (accessToken, refreshToken) => {
    try {
      console.log('AuthContext: Verifying token in background...');
      
      const isValid = await verifyToken(accessToken);
      
      if (!isValid) {
        console.log('AuthContext: Token invalid, attempting refresh...');
        
        if (refreshToken) {
          const refreshed = await refreshAuthToken(refreshToken);
          if (!refreshed) {
            console.log('AuthContext: Token refresh failed, logging out');
            await handleAuthFailure();
          }
        } else {
          console.log('AuthContext: No refresh token available, logging out');
          await handleAuthFailure();
        }
      } else {
        console.log('AuthContext: Token is valid');
      }
    } catch (error) {
      console.error('AuthContext: Background token verification failed:', error);
    }
  };

  const handleAuthFailure = async () => {
    console.log('AuthContext: Handling auth failure...');
    
    // Clear state
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setSessionToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    AuthStorage.clearAuthData();
    
    // Only redirect to login if not already on public pages
    const publicPaths = ['/login', '/register', '/', '/auth'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));
    
    if (!isPublicPath) {
      router.push('/login');
    }
  };

  const verifyToken = async (accessToken) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId
        },
      });

      const result = await response.json();
      return response.ok && result.valid;
    } catch (error) {
      console.error('AuthContext: Token verification error:', error);
      return false;
    }
  };

  const refreshAuthToken = async (refreshToken) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Update tokens in state
          setToken(result.accessToken);
          
          if (result.refreshToken) {
            setRefreshToken(result.refreshToken);
          }

          // Update tokens in localStorage
          AuthStorage.updateTokens({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
          });
          
          console.log('AuthContext: Token refreshed successfully');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('AuthContext: Token refresh error:', error);
      return false;
    }
  };

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      
      console.log('AuthContext: Attempting login...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId
        },
        body: JSON.stringify({ 
          identifier, 
          password,
          deviceInfo: {
            deviceId,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        const userData = result.user;
        const tokens = {
          accessToken: result.accessToken || result.token,
          refreshToken: result.refreshToken,
          sessionToken: result.sessionToken
        };

        // Store in localStorage first
        const stored = AuthStorage.storeAuthData({
          user: userData,
          tokens
        });

        if (stored) {
          // Update state
          setUser(userData);
          setToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);
          setSessionToken(tokens.sessionToken);
          setIsAuthenticated(true);

          console.log('AuthContext: Login successful, auth state updated');
          return { success: true, user: userData };
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        console.log('AuthContext: Login failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (shouldRedirect = true) => {
    try {
      console.log('AuthContext: Logging out...');
      
      // Call logout API if session token exists
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Device-ID': deviceId
          },
          body: JSON.stringify({ sessionToken }),
        });
      }
    } catch (error) {
      console.error('AuthContext: Logout API error:', error);
    } finally {
      await handleAuthFailure();
      
      // Only redirect if requested
      if (shouldRedirect && typeof window !== 'undefined' && window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  };

  const getAuthHeaders = () => {
    const accessToken = token || AuthStorage.getAccessToken();
    
    if (!accessToken) return {};
    
    return {
      'Authorization': `Bearer ${accessToken}`,
      'X-Session-Token': sessionToken || AuthStorage.getSessionToken() || '',
      'X-Device-ID': deviceId || '',
      'Content-Type': 'application/json'
    };
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    // Add your role-based permission logic here
    return true;
  };

  // Force refresh auth state (useful for development)
  const refreshAuthState = () => {
    setAuthInitialized(false);
    initializeAuth();
  };

  // Derived values
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || user?.email || 'User';
  const userRole = user?.role || 'Member';

  const value = {
    user,
    token,
    refreshToken,
    sessionToken,
    loading,
    isAuthenticated,
    authInitialized,
    deviceId,
    userName,
    userRole,
    login,
    logout,
    verifyToken,
    refreshAuthToken,
    getAuthHeaders,
    hasPermission,
    refreshAuthState,
    // Utility methods
    clearAuthData: AuthStorage.clearAuthData,
    isStorageAuthenticated: AuthStorage.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};