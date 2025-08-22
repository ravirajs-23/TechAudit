class Questionnaire {
  constructor(id, title, version, description, createdAt = null, updatedAt = null) {
    this.id = id;
    this.title = title;
    this.version = version;
    this.description = description;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Validate questionnaire data
   * @returns {string[]} Array of validation errors
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Questionnaire title is required');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Questionnaire title must be less than 200 characters');
    }

    if (!this.version || this.version.trim().length === 0) {
      errors.push('Questionnaire version is required');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('Questionnaire description must be less than 1000 characters');
    }

    return errors;
  }

  /**
   * Get full title with version
   * @returns {string}
   */
  getFullTitle() {
    return `${this.title} v${this.version}`;
  }

  /**
   * Check if this is the latest version
   * @param {string} latestVersion
   * @returns {boolean}
   */
  isLatestVersion(latestVersion) {
    return this.version === latestVersion;
  }

  /**
   * Update questionnaire data
   * @param {Object} updateData
   */
  update(updateData) {
    if (updateData.title !== undefined) this.title = updateData.title;
    if (updateData.version !== undefined) this.version = updateData.version;
    if (updateData.description !== undefined) this.description = updateData.description;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Get questionnaire summary
   * @returns {string}
   */
  getSummary() {
    const title = this.title.length > 50 ? this.title.substring(0, 50) + '...' : this.title;
    return `${title} [v${this.version}]`;
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      version: this.version,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Questionnaire;
