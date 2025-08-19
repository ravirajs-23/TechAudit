class Question {
  constructor(id, sectionId, text, guidance = '', evidenceRequired = '', weight = 1, order = 1, createdAt = new Date()) {
    this.id = id;
    this.sectionId = sectionId;
    this.text = text;
    this.guidance = guidance;
    this.evidenceRequired = evidenceRequired;
    this.weight = weight;
    this.order = order;
    this.createdAt = createdAt;
  }

  get maxScore() {
    return this.weight * 2; // Maximum score is 2 points (Compliant)
  }

  get weightedScore() {
    return this.weight * 100; // Convert to percentage
  }

  isFirstQuestion() {
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
    
    if (!this.sectionId) {
      errors.push('Section ID is required');
    }
    
    if (!this.text || this.text.trim().length === 0) {
      errors.push('Question text is required');
    }
    
    if (this.text && this.text.length > 500) {
      errors.push('Question text cannot exceed 500 characters');
    }
    
    if (this.guidance && this.guidance.length > 1000) {
      errors.push('Question guidance cannot exceed 1000 characters');
    }
    
    if (this.evidenceRequired && this.evidenceRequired.length > 500) {
      errors.push('Evidence requirement cannot exceed 500 characters');
    }
    
    if (this.weight < 0 || this.weight > 10) {
      errors.push('Question weight must be between 0 and 10');
    }
    
    if (this.order < 1) {
      errors.push('Question order must be at least 1');
    }
    
    return errors;
  }
}

module.exports = Question;
