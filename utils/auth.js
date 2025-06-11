import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthUtils {
  // Hash password
  static async hashPassword(password) {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      return isValid;
    } catch (error) {
      throw new Error('Password verification failed');
    }
  }

  // Generate JWT token
  static generateToken(payload) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    } catch (error) {
      console.error('Token generation failed:', error.message);
      throw error;
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET environment variable is not set');
        return null;
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    try {
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
      return refreshToken;
    } catch (error) {
      throw new Error('Refresh token generation failed');
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Refresh token verification failed');
    }
  }
}