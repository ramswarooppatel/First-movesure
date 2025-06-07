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
  static generateToken(payload, expiresIn = '24h') {
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
      return token;
    } catch (error) {
      throw new Error('Token generation failed');
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token verification failed');
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