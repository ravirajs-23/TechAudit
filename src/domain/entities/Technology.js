class Technology {
  constructor(id, name, version, vendor, category, riskLevel, description, createdAt = null, updatedAt = null) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.vendor = vendor;
    this.category = category;
    this.riskLevel = riskLevel;
    this.description = description;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Validate technology data
   * @returns {string[]} Array of validation errors
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Technology name is required');
    }

    if (this.name && this.name.length > 100) {
      errors.push('Technology name must be less than 100 characters');
    }

    if (!this.version || this.version.trim().length === 0) {
      errors.push('Technology version is required');
    }

    if (this.version && this.version.length > 50) {
      errors.push('Technology version must be less than 50 characters');
    }

    if (this.vendor && this.vendor.length > 100) {
      errors.push('Vendor name must be less than 100 characters');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('Technology category is required');
    }

    if (this.category && this.category.length > 50) {
      errors.push('Technology category must be less than 50 characters');
    }

    if (!this.riskLevel || !['low', 'medium', 'high', 'critical'].includes(this.riskLevel)) {
      errors.push('Risk level must be one of: low, medium, high, critical');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('Technology description must be less than 1000 characters');
    }

    return errors;
  }

  /**
   * Get full technology name with version
   * @returns {string}
   */
  getFullName() {
    return `${this.name} ${this.version}`;
  }

  /**
   * Get risk score (1-4)
   * @returns {number}
   */
  getRiskScore() {
    const riskScores = { low: 1, medium: 2, high: 3, critical: 4 };
    return riskScores[this.riskLevel] || 2;
  }

  /**
   * Check if this is a high-risk technology
   * @returns {boolean}
   */
  isHighRisk() {
    return this.riskLevel === 'high' || this.riskLevel === 'critical';
  }

  /**
   * Check if this is a critical-risk technology
   * @returns {boolean}
   */
  isCriticalRisk() {
    return this.riskLevel === 'critical';
  }

  /**
   * Get technology summary
   * @returns {string}
   */
  getSummary() {
    const name = this.name.length > 30 ? this.name.substring(0, 30) + '...' : this.name;
    return `${name} ${this.version} [${this.riskLevel} risk]`;
  }

  /**
   * Update technology data
   * @param {Object} updateData
   */
  update(updateData) {
    if (updateData.name !== undefined) this.name = updateData.name;
    if (updateData.version !== undefined) this.version = updateData.version;
    if (updateData.vendor !== undefined) this.vendor = updateData.vendor;
    if (updateData.category !== undefined) this.category = updateData.category;
    if (updateData.riskLevel !== undefined) this.riskLevel = updateData.riskLevel;
    if (updateData.description !== undefined) this.description = updateData.description;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      vendor: this.vendor,
      category: this.category,
      riskLevel: this.riskLevel,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Technology;
