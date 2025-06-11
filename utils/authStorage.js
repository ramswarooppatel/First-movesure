"use client";

// Centralized auth storage keys
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'movesure_access_token',
  REFRESH_TOKEN: 'movesure_refresh_token',
  SESSION_TOKEN: 'movesure_session_token',
  USER_DATA: 'movesure_user_data',
  AUTH_STATE: 'movesure_auth_state',
  LAST_LOGIN: 'movesure_last_login',
  DEVICE_ID: 'movesure_device_id'
};

export class AuthStorage {
  // Check if we're in browser environment
  static isBrowser() {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Generate a unique device ID
  static generateDeviceId() {
    if (!this.isBrowser()) return null;
    
    let deviceId = localStorage.getItem(AUTH_STORAGE_KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(AUTH_STORAGE_KEYS.DEVICE_ID, deviceId);
    }
    return deviceId;
  }

  // Store complete auth data
  static storeAuthData(authData) {
    if (!this.isBrowser()) return false;

    try {
      const { user, tokens } = authData;
      
      // Store individual items
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      localStorage.setItem(AUTH_STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
      
      if (tokens.refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
      
      if (tokens.sessionToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.SESSION_TOKEN, tokens.sessionToken);
      }

      // Store auth state flag
      localStorage.setItem(AUTH_STORAGE_KEYS.AUTH_STATE, 'authenticated');

      console.log('AuthStorage: Auth data stored successfully');
      return true;
    } catch (error) {
      console.error('AuthStorage: Failed to store auth data:', error);
      return false;
    }
  }

  // Retrieve complete auth data
  static getAuthData() {
    if (!this.isBrowser()) return null;

    try {
      const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      const sessionToken = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_TOKEN);
      const userDataStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
      const authState = localStorage.getItem(AUTH_STORAGE_KEYS.AUTH_STATE);
      const lastLogin = localStorage.getItem(AUTH_STORAGE_KEYS.LAST_LOGIN);

      if (!accessToken || !userDataStr || authState !== 'authenticated') {
        return null;
      }

      const userData = JSON.parse(userDataStr);

      return {
        user: userData,
        tokens: {
          accessToken,
          refreshToken,
          sessionToken
        },
        lastLogin,
        deviceId: this.generateDeviceId()
      };
    } catch (error) {
      console.error('AuthStorage: Failed to retrieve auth data:', error);
      this.clearAuthData(); // Clear corrupted data
      return null;
    }
  }

  // Update tokens only
  static updateTokens(tokens) {
    if (!this.isBrowser()) return false;

    try {
      if (tokens.accessToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      }
      
      if (tokens.refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
      
      if (tokens.sessionToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.SESSION_TOKEN, tokens.sessionToken);
      }

      console.log('AuthStorage: Tokens updated successfully');
      return true;
    } catch (error) {
      console.error('AuthStorage: Failed to update tokens:', error);
      return false;
    }
  }

  // Clear all auth data
  static clearAuthData() {
    if (!this.isBrowser()) return;

    try {
      Object.values(AUTH_STORAGE_KEYS).forEach(key => {
        if (key !== AUTH_STORAGE_KEYS.DEVICE_ID) { // Keep device ID
          localStorage.removeItem(key);
        }
      });

      console.log('AuthStorage: Auth data cleared successfully');
    } catch (error) {
      console.error('AuthStorage: Failed to clear auth data:', error);
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    if (!this.isBrowser()) return false;

    const authData = this.getAuthData();
    return authData !== null && authData.tokens.accessToken !== null;
  }

  // Get access token for API calls
  static getAccessToken() {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Get refresh token
  static getRefreshToken() {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Get session token
  static getSessionToken() {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_TOKEN);
  }

  // Get user data
  static getUserData() {
    if (!this.isBrowser()) return null;

    try {
      const userDataStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
      return userDataStr ? JSON.parse(userDataStr) : null;
    } catch (error) {
      console.error('AuthStorage: Failed to parse user data:', error);
      return null;
    }
  }

  // Check if auth data is expired (simple check)
  static isAuthDataExpired() {
    if (!this.isBrowser()) return true;

    const lastLogin = localStorage.getItem(AUTH_STORAGE_KEYS.LAST_LOGIN);
    if (!lastLogin) return true;

    // Check if last login was more than 7 days ago
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const daysDiff = (now - loginDate) / (1000 * 60 * 60 * 24);

    return daysDiff > 7;
  }
}