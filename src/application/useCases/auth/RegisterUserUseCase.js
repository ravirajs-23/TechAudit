const User = require('../../../domain/entities/User');

class RegisterUserUseCase {
  constructor(userRepository, authService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute(userData) {
    try {
      // Validate input data
      const validationErrors = this.validateInput(userData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.authService.hashPassword(userData.password);

      // Create user entity
      const user = new User(
        null, // ID will be set by repository
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || 'auditor'
      );

      // Validate entity
      const entityErrors = user.validate();
      if (entityErrors.length > 0) {
        throw new Error(`Entity validation failed: ${entityErrors.join(', ')}`);
      }

      // Save user to database
      const savedUser = await this.userRepository.create(user);

      // Generate JWT token
      const token = await this.authService.generateToken(savedUser);

      // Return user data without password
      const { password, ...userWithoutPassword } = savedUser;
      
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

  validateInput(userData) {
    const errors = [];
    
    if (!userData.email) errors.push('Email is required');
    if (!userData.password) errors.push('Password is required');
    if (!userData.firstName) errors.push('First name is required');
    if (!userData.lastName) errors.push('Last name is required');
    
    if (userData.email && !userData.email.includes('@')) {
      errors.push('Valid email format is required');
    }
    
    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (userData.role && !['admin', 'auditor'].includes(userData.role)) {
      errors.push('Role must be either admin or auditor');
    }
    
    return errors;
  }
}

module.exports = RegisterUserUseCase;
