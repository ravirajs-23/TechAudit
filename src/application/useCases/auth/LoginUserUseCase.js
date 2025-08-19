class LoginUserUseCase {
  constructor(userRepository, authService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute(email, password) {
    try {
      // Validate input
      const validationErrors = this.validateInput(email, password);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }

      // Verify password
      const isPasswordValid = await this.authService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = await this.authService.generateToken(user);

      // Return user data without password
      const { password: userPassword, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  validateInput(email, password) {
    const errors = [];
    
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    
    if (email && !email.includes('@')) {
      errors.push('Valid email format is required');
    }
    
    if (password && password.length < 1) {
      errors.push('Password is required');
    }
    
    return errors;
  }
}

module.exports = LoginUserUseCase;
