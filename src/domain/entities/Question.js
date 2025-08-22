class Question {
  constructor(id, text, guidance, evidenceRequired, createdAt = null, updatedAt = null) {
    this.id = id;
    this.text = text;
    this.guidance = guidance;
    this.evidenceRequired = evidenceRequired;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validate question data
   * @returns {string[]} Array of validation errors
   */
  validate() {
    const errors = [];

    if (!this.text || this.text.trim().length === 0) {
      errors.push('Question text is required');
    }

    if (this.text && this.text.length > 1000) {
      errors.push('Question text cannot exceed 1000 characters');
    }

    if (!this.evidenceRequired) {
      errors.push('Evidence requirement is required');
    }

    if (this.evidenceRequired && !['Yes', 'No', 'Optional'].includes(this.evidenceRequired)) {
      errors.push('Evidence required must be one of: Yes, No, Optional');
    }

    if (this.guidance && this.guidance.length > 2000) {
      errors.push('Guidance cannot exceed 2000 characters');
    }

    return errors;
  }

  /**
   * Check if evidence is required
   * @returns {boolean}
   */
  isEvidenceRequired() {
    return this.evidenceRequired === 'Yes';
  }

  /**
   * Check if evidence is optional
   * @returns {boolean}
   */
  isEvidenceOptional() {
    return this.evidenceRequired === 'Optional';
  }

  /**
   * Check if no evidence is needed
   * @returns {boolean}
   */
  isNoEvidenceNeeded() {
    return this.evidenceRequired === 'No';
  }

  /**
   * Get question summary
   * @returns {string}
   */
  getSummary() {
    const text = this.text.length > 100 ? this.text.substring(0, 100) + '...' : this.text;
    return `${text} [Evidence: ${this.evidenceRequired}]`;
  }

  /**
   * Update question data
   * @param {Object} updateData
   */
  update(updateData) {
    if (updateData.text !== undefined) this.text = updateData.text;
    if (updateData.guidance !== undefined) this.guidance = updateData.guidance;
    if (updateData.evidenceRequired !== undefined) this.evidenceRequired = updateData.evidenceRequired;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      text: this.text,
      guidance: this.guidance,
      evidenceRequired: this.evidenceRequired,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Question;
