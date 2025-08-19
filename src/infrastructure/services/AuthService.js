const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const IAuthService = require('../../domain/services/IAuthService');

class AuthService extends IAuthService {
  constructor() {
    super();
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  }

  async register(userData) {
    try {
      // This method is not used directly, registration is handled by use case
      throw new Error('Use RegisterUserUseCase instead');
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      // This method is not used directly, login is handled by use case
      throw new Error('Use LoginUserUseCase instead');
    } catch (error) {
      throw error;
    }
  }

  async generateToken(user) {
    try {
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };

      const token = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
        issuer: 'tech-audit-api',
        audience: 'tech-audit-users'
      });

      return token;
    } catch (error) {
      throw new Error(`Failed to generate token: ${error.message}`);
    }
  }

  async generateRefreshToken(user) {
    try {
      const payload = {
        id: user.id,
        type: 'refresh'
      };

      const refreshToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.refreshTokenExpiresIn,
        issuer: 'tech-audit-api',
        audience: 'tech-audit-users'
      });

      return refreshToken;
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'tech-audit-api',
        audience: 'tech-audit-users'
      });

      return {
        valid: true,
        payload: decoded
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          valid: false,
          error: 'Token expired'
        };
      } else if (error.name === 'JsonWebTokenError') {
        return {
          valid: false,
          error: 'Invalid token'
        };
      } else {
        return {
          valid: false,
          error: 'Token verification failed'
        };
      }
    }
  }

  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(12);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(`Failed to hash password: ${error.message}`);
    }
  }

  async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Failed to compare password: ${error.message}`);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const verification = await this.verifyToken(refreshToken);
      
      if (!verification.valid) {
        throw new Error(verification.error);
      }

      if (verification.payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Generate new access token
      const newToken = jwt.sign(
        {
          id: verification.payload.id,
          email: verification.payload.email,
          role: verification.payload.role,
          firstName: verification.payload.firstName,
          lastName: verification.payload.lastName
        },
        this.jwtSecret,
        {
          expiresIn: this.jwtExpiresIn,
          issuer: 'tech-audit-api',
          audience: 'tech-audit-users'
        }
      );

      return newToken;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  async logout(token) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return success
      return true;
    } catch (error) {
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }

  // Helper method to extract token from authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

module.exports = AuthService;
