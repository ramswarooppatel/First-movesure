import { supabaseAdmin } from '@/utils/supabase';
import { AuthUtils } from '@/utils/auth';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  // Check username uniqueness
  static async checkUsernameAvailability(username) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found - username is available
        return { available: true };
      }

      if (error) {
        throw error;
      }

      // Username exists
      return { available: false, message: 'Username already exists' };
    } catch (error) {
      console.error('Username check error:', error);
      return { available: false, message: 'Error checking username availability' };
    }
  }

  // Login with username or phone
  static async login(identifier, password, deviceInfo = {}) {
    try {
      // Check if identifier is phone or username
      const isPhone = /^\+?[\d\s\-\(\)]+$/.test(identifier);
      
      const query = supabaseAdmin
        .from('users')
        .select(`
          id,
          username,
          email,
          phone,
          password_hash,
          role,
          company_id,
          branch_id,
          first_name,
          last_name,
          is_active,
          companies!inner(
            id,
            name,
            is_active
          )
        `)
        .eq('is_active', true);

      if (isPhone) {
        query.eq('phone', identifier);
      } else {
        query.eq('username', identifier.toLowerCase());
      }

      const { data: user, error } = await query.single();

      if (error || !user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Check if company is active
      if (!user.companies.is_active) {
        return {
          success: false,
          error: 'Company account is deactivated'
        };
      }

      // Verify password
      const isValidPassword = await AuthUtils.verifyPassword(password, user.password_hash);
      
      if (!isValidPassword) {
        // Log failed login attempt
        await this.createLoginAudit(user.id, deviceInfo, 'failed', 'Invalid password');
        
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Generate tokens
      const accessToken = AuthUtils.generateToken({
        userId: user.id,
        role: user.role,
        companyId: user.company_id,
        branchId: user.branch_id
      });

      const refreshToken = AuthUtils.generateRefreshToken({
        userId: user.id,
        type: 'refresh'
      });

      const sessionToken = uuidv4();

      // Store tokens in database
      await this.storeTokens(user.id, accessToken, refreshToken, sessionToken, deviceInfo);

      // Log successful login
      await this.createLoginAudit(user.id, deviceInfo, 'success');

      // Update last login
      await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          companyId: user.company_id,
          branchId: user.branch_id,
          firstName: user.first_name,
          lastName: user.last_name,
          companyName: user.companies.name
        },
        tokens: {
          accessToken,
          refreshToken,
          sessionToken
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  // Store tokens in database
  static async storeTokens(userId, accessToken, refreshToken, sessionToken, deviceInfo) {
    try {
      // Store access token
      await supabaseAdmin
        .from('access_tokens')
        .insert({
          user_id: userId,
          token: accessToken,
          token_type: 'bearer',
          refresh_token: refreshToken,
          device_info: JSON.stringify(deviceInfo),
          ip_address: deviceInfo.ip_address,
          user_agent: deviceInfo.user_agent,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          is_revoked: false
        });

      // Store session
      await supabaseAdmin
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          device_id: deviceInfo.device_id || `web-${Date.now()}`,
          device_name: deviceInfo.device_name || 'Web Browser',
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

    } catch (error) {
      console.error('Token storage error:', error);
    }
  }

  // Create login audit
  static async createLoginAudit(userId, deviceInfo, status, failureReason = null) {
    try {
      await supabaseAdmin
        .from('login_audit')
        .insert({
          user_id: userId,
          ip_address: deviceInfo.ip_address,
          user_agent: deviceInfo.user_agent,
          device_type: deviceInfo.device_type,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          location_city: deviceInfo.location_city,
          location_country: deviceInfo.location_country,
          login_status: status,
          failure_reason: failureReason
        });
    } catch (error) {
      console.error('Login audit error:', error);
    }
  }

  // Logout
  static async logout(sessionToken) {
    try {
      // Deactivate session
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken);

      // Revoke access tokens associated with this session
      await supabaseAdmin
        .from('access_tokens')
        .update({ is_revoked: true })
        .eq('session_token', sessionToken);

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  // Refresh token
  static async refreshToken(refreshToken) {
    try {
      const decoded = AuthUtils.verifyRefreshToken(refreshToken);
      
      // Get user details
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, role, company_id, branch_id, is_active')
        .eq('id', decoded.userId)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        return { success: false, error: 'Invalid refresh token' };
      }

      // Generate new access token
      const newAccessToken = AuthUtils.generateToken({
        userId: user.id,
        role: user.role,
        companyId: user.company_id,
        branchId: user.branch_id
      });

      return {
        success: true,
        accessToken: newAccessToken
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Token refresh failed' };
    }
  }
}