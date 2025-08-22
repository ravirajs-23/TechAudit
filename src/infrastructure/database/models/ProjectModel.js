const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Project description cannot exceed 1000 characters']
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'on-hold', 'cancelled'],
      message: 'Status must be either active, completed, on-hold, or cancelled'
    },
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.durationInDays = doc.durationInDays;
      ret.isActive = doc.isActive;
      ret.isCompleted = doc.isCompleted;
      ret.isOverdue = doc.isOverdue;
      return ret;
    }
  }
});

// Virtual for checking if project is active
projectSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Virtual for checking if project is completed
projectSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Virtual for checking if project is overdue
projectSchema.virtual('isOverdue').get(function() {
  return this.endDate && new Date() > this.endDate && !this.isCompleted;
});

// Indexes for better query performance
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ status: 1, createdAt: 1 });

// Static method to find active projects
projectSchema.statics.findActiveProjects = function() {
  return this.find({ status: 'active' });
};

// Static method to find projects by client
projectSchema.statics.findByClient = function(client) {
  return this.find({ client: new RegExp(client, 'i') });
};

// Static method to find overdue projects
projectSchema.statics.findOverdueProjects = function() {
  return this.find({
    endDate: { $lt: new Date() },
    status: { $ne: 'completed' }
  });
};

// Instance method to update project status
projectSchema.methods.updateStatus = function(newStatus) {
  if (['active', 'completed', 'on-hold', 'cancelled'].includes(newStatus)) {
    this.status = newStatus;
    if (newStatus === 'completed') {
      this.endDate = this.endDate || new Date();
    }
    return this.save();
  }
  throw new Error('Invalid status');
};

module.exports = mongoose.model('Project', projectSchema);
