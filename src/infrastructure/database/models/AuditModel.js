const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  leadAuditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lead auditor ID is required']
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: {
      values: ['planning', 'in-progress', 'review', 'completed', 'cancelled'],
      message: 'Status must be either planning, in-progress, review, completed, or cancelled'
    },
    default: 'planning'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !this.startDate || !value || value > this.startDate;
      },
      message: 'Completion date must be after start date'
    }
  },
  overallScore: {
    type: Number,
    min: [0, 'Overall score cannot be negative'],
    max: [100, 'Overall score cannot exceed 100'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.durationInDays = doc.durationInDays;
      ret.isOverdue = doc.isOverdue;
      ret.progressPercentage = doc.progressPercentage;
      return ret;
    }
  }
});

// Virtual for calculating duration in days
auditSchema.virtual('durationInDays').get(function() {
  if (!this.startDate || !this.completionDate) return 0;
  const diffTime = Math.abs(this.completionDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for checking if audit is overdue
auditSchema.virtual('isOverdue').get(function() {
  const defaultDuration = 14; // 2 weeks default
  const actualDuration = this.durationInDays;
  return actualDuration > defaultDuration && this.status !== 'completed';
});

// Virtual for progress percentage
auditSchema.virtual('progressPercentage').get(function() {
  const statusProgress = {
    'planning': 10,
    'in-progress': 50,
    'review': 80,
    'completed': 100,
    'cancelled': 0
  };
  return statusProgress[this.status] || 0;
});

// Indexes for better query performance
auditSchema.index({ projectId: 1 });
auditSchema.index({ status: 1 });
auditSchema.index({ leadAuditorId: 1 });
auditSchema.index({ startDate: 1, completionDate: 1 });
auditSchema.index({ projectId: 1, status: 1 });

// Static method to find audits by project
auditSchema.statics.findByProject = function(projectId) {
  return this.find({ projectId }).populate('leadAuditorId', 'firstName lastName email');
};

// Static method to find audits by status
auditSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('projectId', 'name client');
};

// Static method to find audits by lead auditor
auditSchema.statics.findByLeadAuditor = function(auditorId) {
  return this.find({ leadAuditorId: auditorId }).populate('projectId', 'name client');
};

// Static method to find overdue audits
auditSchema.statics.findOverdueAudits = function() {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  return this.find({
    startDate: { $lt: twoWeeksAgo },
    status: { $nin: ['completed', 'cancelled'] }
  });
};

// Instance method to add team member
auditSchema.methods.addTeamMember = function(userId) {
  if (!this.teamMembers.includes(userId)) {
    this.teamMembers.push(userId);
    return this.save();
  }
  return this;
};

// Instance method to remove team member
auditSchema.methods.removeTeamMember = function(userId) {
  this.teamMembers = this.teamMembers.filter(id => id.toString() !== userId.toString());
  return this.save();
};

// Instance method to start audit
auditSchema.methods.startAudit = function() {
  if (this.status === 'planning') {
    this.status = 'in-progress';
    this.startDate = new Date();
    return this.save();
  }
  throw new Error('Audit can only be started from planning status');
};

// Instance method to complete audit
auditSchema.methods.completeAudit = function() {
  if (this.status === 'review') {
    this.status = 'completed';
    this.completionDate = new Date();
    return this.save();
  }
  throw new Error('Audit can only be completed from review status');
};

// Instance method to cancel audit
auditSchema.methods.cancelAudit = function() {
  this.status = 'cancelled';
  this.completionDate = new Date();
  return this.save();
};

// Instance method to update score
auditSchema.methods.updateScore = function(newScore) {
  if (newScore >= 0 && newScore <= 100) {
    this.overallScore = newScore;
    return this.save();
  }
  throw new Error('Score must be between 0 and 100');
};

// Pre-save middleware to validate project exists
auditSchema.pre('save', async function(next) {
  try {
    const Project = mongoose.model('Project');
    const project = await Project.findById(this.projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to validate lead auditor exists
auditSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const auditor = await User.findById(this.leadAuditorId);
    if (!auditor) {
      throw new Error('Lead auditor not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Audit', auditSchema);
