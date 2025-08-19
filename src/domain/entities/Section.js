class Section {
  constructor(id, questionnaireId, title, description, weight = 1, order = 1, createdAt = new Date()) {
    this.id = id;
    this.questionnaireId = questionnaireId;
    this.title = title;
    this.description = description;
    this.weight = weight;
    this.order = order;
    this.createdAt = createdAt;
  }

  get weightedScore() {
    return this.weight * 100; // Convert to percentage
  }

  isFirstSection() {
    return this.order === 1;
  }

  moveUp() {
    if (this.order > 1) {
      this.order--;
    }
  }

  moveDown() {
    this.order++;
  }

  validate() {
    const errors = [];
    
    if (!this.questionnaireId) {
      errors.push('Questionnaire ID is required');
    }
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Section title is required');
    }
    
    if (this.title && this.title.length > 150) {
      errors.push('Section title cannot exceed 150 characters');
    }
    
    if (this.description && this.description.length > 500) {
      errors.push('Section description cannot exceed 500 characters');
    }
    
    if (this.weight < 0 || this.weight > 10) {
      errors.push('Section weight must be between 0 and 10');
    }
    
    if (this.order < 1) {
      errors.push('Section order must be at least 1');
    }
    
    return errors;
  }
}

module.exports = Section;
