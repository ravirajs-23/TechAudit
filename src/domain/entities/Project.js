class Project {
  constructor(id, name, description, client, startDate, endDate, status = 'active', createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.client = client;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.createdAt = createdAt;
  }

  get durationInDays() {
    if (!this.startDate || !this.endDate) return 0;
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isActive() {
    return this.status === 'active';
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isOverdue() {
    return this.endDate && new Date() > this.endDate && !this.isCompleted();
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Project name is required');
    }
    
    if (this.name && this.name.length > 100) {
      errors.push('Project name cannot exceed 100 characters');
    }
    
    if (!this.client || this.client.trim().length === 0) {
      errors.push('Client name is required');
    }
    
    if (this.startDate && this.endDate && this.startDate >= this.endDate) {
      errors.push('End date must be after start date');
    }
    
    if (!['active', 'completed', 'on-hold', 'cancelled'].includes(this.status)) {
      errors.push('Invalid project status');
    }
    
    return errors;
  }
}

module.exports = Project;
