class Questionnaire {
  constructor(id, technologyId, version, title, description, lastUpdated = new Date(), createdAt = new Date()) {
    this.id = id;
    this.technologyId = technologyId;
    this.version = version;
    this.title = title;
    this.description = description;
    this.lastUpdated = lastUpdated;
    this.createdAt = createdAt;
  }

  get fullTitle() {
    return `${this.title} v${this.version}`;
  }

  isLatestVersion() {
    return this.lastUpdated === this.createdAt;
  }

  updateVersion(newVersion) {
    this.version = newVersion;
    this.lastUpdated = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.technologyId) {
      errors.push('Technology ID is required');
    }
    
    if (!this.version || this.version.trim().length === 0) {
      errors.push('Questionnaire version is required');
    }
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Questionnaire title is required');
    }
    
    if (this.title && this.title.length > 200) {
      errors.push('Questionnaire title cannot exceed 200 characters');
    }
    
    if (this.description && this.description.length > 1000) {
      errors.push('Questionnaire description cannot exceed 1000 characters');
    }
    
    return errors;
  }
}

module.exports = Questionnaire;
