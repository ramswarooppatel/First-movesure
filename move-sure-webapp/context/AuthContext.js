"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  // Check authentication state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('movesure_token');
        const storedRefreshToken = localStorage.getItem('movesure_refresh_token');
        const storedSessionToken = localStorage.getItem('movesure_session');
        const storedUser = localStorage.getItem('movesure_user');

        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            
            // Verify token validity
            const isValid = await verifyToken(storedToken);
            
            if (isValid) {
              setUser(userData);
              setToken(storedToken);
              setRefreshToken(storedRefreshToken);
              setSessionToken(storedSessionToken);
              setIsAuthenticated(true);
              
              // Update last activity
              updateLastActivity();
            } else {
              // Try to refresh token
              if (storedRefreshToken) {
                await refreshAuthToken(storedRefreshToken);
              } else {
                logout();
              }
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  const refreshAuthToken = async (refreshTokenToUse = null) => {
    try {
      const tokenToUse = refreshTokenToUse || refreshToken;
      
      if (!tokenToUse) {
        logout();
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokenToUse })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setToken(result.accessToken);
          localStorage.setItem('movesure_token', result.accessToken);
          
          if (result.user) {
            setUser(result.user);
            localStorage.setItem('movesure_user', JSON.stringify(result.user));
          }
          
          return true;
        }
      }
      
      logout();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (result.success) {
        const userData = result.user;
        const tokens = {
          accessToken: result.token || result.accessToken,
          refreshToken: result.refreshToken,
          sessionToken: result.sessionToken
        };
        
        // Store auth data in localStorage only
        setUser(userData);
        setToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setSessionToken(tokens.sessionToken);
        setIsAuthenticated(true);
        
        localStorage.setItem('movesure_token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('movesure_refresh_token', tokens.refreshToken);
        }
        if (tokens.sessionToken) {
          localStorage.setItem('movesure_session', tokens.sessionToken);
        }
        localStorage.setItem('movesure_user', JSON.stringify(userData));
        
        updateLastActivity();
        clearRegistrationData();
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if session token exists
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken }),
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all auth state
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setSessionToken(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('movesure_token');
        localStorage.removeItem('movesure_refresh_token');
        localStorage.removeItem('movesure_session');
        localStorage.removeItem('movesure_user');
        localStorage.removeItem('movesure_last_activity');
      }
      
      // Redirect to login
      router.push('/login');
    }
  };

  const updateLastActivity = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('movesure_last_activity', new Date().toISOString());
    }
  };

  const clearRegistrationData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('movesure_registration_form_data');
      localStorage.removeItem('movesure_registration_current_step');
      localStorage.removeItem('movesure_registration_last_saved');
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('movesure_user', JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission) => {
    if (!user || !isAuthenticated) return false;
    
    if (user.role === 'super_admin') return true;
    
    const rolePermissions = {
      admin: ['read', 'write', 'manage_users', 'manage_branches'],
      manager: ['read', 'write', 'manage_staff'],
      staff: ['read', 'write'],
      viewer: ['read']
    };
    
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const getAuthHeaders = () => {
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
      'X-Session-Token': sessionToken || '',
      'Content-Type': 'application/json'
    };
  };

  const value = {
    // State
    user,
    token,
    refreshToken,
    sessionToken,
    loading,
    isAuthenticated,
    
    // Methods
    login,
    logout,
    refreshAuthToken,
    updateUserProfile,
    hasPermission,
    getAuthHeaders,
    updateLastActivity,
    
    // Computed values
    userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    userRole: user?.role || null,
    companyId: user?.companyId || null,
    branchId: user?.branchId || null,
    companyName: user?.companyName || ''
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};