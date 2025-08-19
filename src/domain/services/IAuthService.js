class IAuthService {
  async register(userData) {
    throw new Error('register method must be implemented');
  }

  async login(email, password) {
    throw new Error('login method must be implemented');
  }

  async generateToken(user) {
    throw new Error('generateToken method must be implemented');
  }

  async verifyToken(token) {
    throw new Error('verifyToken method must be implemented');
  }

  async hashPassword(password) {
    throw new Error('hashPassword method must be implemented');
  }

  async comparePassword(password, hashedPassword) {
    throw new Error('comparePassword method must be implemented');
  }

  async refreshToken(refreshToken) {
    throw new Error('refreshToken method must be implemented');
  }

  async logout(token) {
    throw new Error('logout method must be implemented');
  }
}

module.exports = IAuthService;
