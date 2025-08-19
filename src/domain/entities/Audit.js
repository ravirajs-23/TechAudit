class Audit {
  constructor(id, projectId, leadAuditorId, teamMembers = [], status = 'planning', startDate = new Date(), completionDate = null, overallScore = 0, createdAt = new Date()) {
    this.id = id;
    this.projectId = projectId;
    this.leadAuditorId = leadAuditorId;
    this.teamMembers = teamMembers;
    this.status = status;
    this.startDate = startDate;
    this.completionDate = completionDate;
    this.overallScore = overallScore;
    this.createdAt = createdAt;
  }

  get durationInDays() {
    if (!this.startDate || !this.completionDate) return 0;
    const diffTime = Math.abs(this.completionDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isOverdue() {
    const defaultDuration = 14; // 2 weeks default
    const actualDuration = this.durationInDays;
    return actualDuration > defaultDuration && this.status !== 'completed';
  }

  get progressPercentage() {
    const statusProgress = {
      'planning': 10,
      'in-progress': 50,
      'review': 80,
      'completed': 100,
      'cancelled': 0
    };
    return statusProgress[this.status] || 0;
  }

  addTeamMember(userId) {
    if (!this.teamMembers.includes(userId)) {
      this.teamMembers.push(userId);
    }
  }

  removeTeamMember(userId) {
    this.teamMembers = this.teamMembers.filter(id => id !== userId);
  }

  startAudit() {
    if (this.status === 'planning') {
      this.status = 'in-progress';
      this.startDate = new Date();
    }
  }

  completeAudit() {
    if (this.status === 'review') {
      this.status = 'completed';
      this.completionDate = new Date();
    }
  }

  cancelAudit() {
    this.status = 'cancelled';
    this.completionDate = new Date();
  }

  updateScore(newScore) {
    if (newScore >= 0 && newScore <= 100) {
      this.overallScore = newScore;
    }
  }

  validate() {
    const errors = [];
    
    if (!this.projectId) {
      errors.push('Project ID is required');
    }
    
    if (!this.leadAuditorId) {
      errors.push('Lead auditor ID is required');
    }
    
    if (!['planning', 'in-progress', 'review', 'completed', 'cancelled'].includes(this.status)) {
      errors.push('Invalid audit status');
    }
    
    if (this.startDate && this.completionDate && this.startDate >= this.completionDate) {
      errors.push('Completion date must be after start date');
    }
    
    if (this.overallScore < 0 || this.overallScore > 100) {
      errors.push('Overall score must be between 0 and 100');
    }
    
    return errors;
  }
}

module.exports = Audit;
