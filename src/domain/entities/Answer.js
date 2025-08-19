class Answer {
  constructor(id, auditId, questionId, complianceStatus, evidence = '', notes = '', answeredBy, answeredAt = new Date(), createdAt = new Date()) {
    this.id = id;
    this.auditId = auditId;
    this.questionId = questionId;
    this.complianceStatus = complianceStatus;
    this.evidence = evidence;
    this.notes = notes;
    this.answeredBy = answeredBy;
    this.answeredAt = answeredAt;
    this.createdAt = createdAt;
  }

  get score() {
    const complianceScores = {
      'compliant': 2,
      'partially-compliant': 1,
      'non-compliant': 0
    };
    return complianceScores[this.complianceStatus] || 0;
  }

  get scorePercentage() {
    return (this.score / 2) * 100; // Convert to percentage (max 2 points)
  }

  get isCompliant() {
    return this.complianceStatus === 'compliant';
  }

  get isPartiallyCompliant() {
    return this.complianceStatus === 'partially-compliant';
  }

  get isNonCompliant() {
    return this.complianceStatus === 'non-compliant';
  }

  updateComplianceStatus(newStatus) {
    if (['compliant', 'partially-compliant', 'non-compliant'].includes(newStatus)) {
      this.complianceStatus = newStatus;
      this.answeredAt = new Date();
    }
  }

  addEvidence(evidence) {
    this.evidence = evidence;
    this.answeredAt = new Date();
  }

  addNotes(notes) {
    this.notes = notes;
    this.answeredAt = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.auditId) {
      errors.push('Audit ID is required');
    }
    
    if (!this.questionId) {
      errors.push('Question ID is required');
    }
    
    if (!this.answeredBy) {
      errors.push('Answered by user ID is required');
    }
    
    if (!['compliant', 'partially-compliant', 'non-compliant'].includes(this.complianceStatus)) {
      errors.push('Invalid compliance status');
    }
    
    if (this.evidence && this.evidence.length > 2000) {
      errors.push('Evidence cannot exceed 2000 characters');
    }
    
    if (this.notes && this.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters');
    }
    
    return errors;
  }
}

module.exports = Answer;
