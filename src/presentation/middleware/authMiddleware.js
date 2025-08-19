const AuthService = require('../../infrastructure/services/AuthService');

class AuthMiddleware {
  constructor() {
    this.authService = new AuthService();
  }

  authenticate(req, res, next) {
    try {
      const token = this.authService.extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Access token is required'
        });
      }

      const verification = this.authService.verifyToken(token);
      
      if (!verification.valid) {
        return res.status(401).json({
          success: false,
          error: verification.error
        });
      }

      // Add user info to request
      req.user = verification.payload;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed'
      });
    }
  }

  authorizeAdmin(req, res, next) {
    this.authenticate(req, res, (err) => {
      if (err) return next(err);
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }
      
      next();
    });
  }

  authorizeAuditor(req, res, next) {
    this.authenticate(req, res, (err) => {
      if (err) return next(err);
      
      if (!['admin', 'auditor'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Auditor or admin access required'
        });
      }
      
      next();
    });
  }

  authorizeRole(allowedRoles) {
    return (req, res, next) => {
      this.authenticate(req, res, (err) => {
        if (err) return next(err);
        
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
          });
        }
        
        next();
      });
    };
  }
}

module.exports = new AuthMiddleware();
