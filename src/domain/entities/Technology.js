class Technology {
  constructor(id, projectId, name, version, vendor, category, riskLevel = 'medium', description = '', createdAt = new Date()) {
    this.id = id;
    this.projectId = projectId;
    this.name = name;
    this.version = version;
    this.vendor = vendor;
    this.category = category;
    this.riskLevel = riskLevel;
    this.description = description;
    this.createdAt = createdAt;
  }

  get fullName() {
    return `${this.name} ${this.version}`;
  }

  get riskScore() {
    const riskScores = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };
    return riskScores[this.riskLevel] || 2;
  }

  isHighRisk() {
    return this.riskLevel === 'high' || this.riskLevel === 'critical';
  }

  validate() {
    const errors = [];
    
    if (!this.projectId) {
      errors.push('Project ID is required');
    }
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Technology name is required');
    }
    
    if (this.name && this.name.length > 100) {
      errors.push('Technology name cannot exceed 100 characters');
    }
    
    if (!this.version || this.version.trim().length === 0) {
      errors.push('Technology version is required');
    }
    
    if (!this.vendor || this.vendor.trim().length === 0) {
      errors.push('Vendor name is required');
    }
    
    if (!this.category || this.category.trim().length === 0) {
      errors.push('Technology category is required');
    }
    
    if (!['low', 'medium', 'high', 'critical'].includes(this.riskLevel)) {
      errors.push('Invalid risk level');
    }
    
    return errors;
  }
}

module.exports = Technology;
