class User {
  constructor(id, email, password, firstName, lastName, role, isActive = true, createdAt = new Date()) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isAuditor() {
    return this.role === 'auditor';
  }

  canAccessAudit() {
    return this.isActive && (this.isAdmin() || this.isAuditor());
  }

  validate() {
    const errors = [];
    
    if (!this.email || !this.email.includes('@')) {
      errors.push('Valid email is required');
    }
    
    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!this.firstName || this.firstName.trim().length === 0) {
      errors.push('First name is required');
    }
    
    if (!this.lastName || this.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }
    
    if (!['admin', 'auditor'].includes(this.role)) {
      errors.push('Role must be either admin or auditor');
    }
    
    return errors;
  }
}

module.exports = User;
