class Section {
  constructor(id, title, description, weight = 1, createdAt = null, updatedAt = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.weight = weight;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Validate section data
   * @returns {string[]} Array of validation errors
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Section title is required');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Section title must be less than 200 characters');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('Section description must be less than 1000 characters');
    }

    if (this.weight < 1 || this.weight > 10) {
      errors.push('Section weight must be between 1 and 10');
    }

    return errors;
  }

  /**
   * Check if this is a high priority section
   * @returns {boolean}
   */
  isHighPriority() {
    return this.weight >= 8;
  }

  /**
   * Check if this is a medium priority section
   * @returns {boolean}
   */
  isMediumPriority() {
    return this.weight >= 5 && this.weight < 8;
  }

  /**
   * Check if this is a low priority section
   * @returns {boolean}
   */
  isLowPriority() {
    return this.weight < 5;
  }

  /**
   * Get section summary
   * @returns {string}
   */
  getSummary() {
    const title = this.title.length > 50 ? this.title.substring(0, 50) + '...' : this.title;
    return `${title} [Weight: ${this.weight}]`;
  }

  /**
   * Update section data
   * @param {Object} updateData
   */
  update(updateData) {
    if (updateData.title !== undefined) this.title = updateData.title;
    if (updateData.description !== undefined) this.description = updateData.description;
    if (updateData.weight !== undefined) this.weight = updateData.weight;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      weight: this.weight,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Section;
