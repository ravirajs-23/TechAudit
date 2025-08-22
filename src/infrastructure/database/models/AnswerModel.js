const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  auditId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audit',
    required: [true, 'Audit ID is required']
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question ID is required']
  },
  complianceStatus: {
    type: String,
    enum: {
      values: ['compliant', 'partially-compliant', 'non-compliant'],
      message: 'Compliance status must be either compliant, partially-compliant, or non-compliant'
    },
    required: [true, 'Compliance status is required']
  },
  evidence: {
    type: String,
    trim: true,
    maxlength: [2000, 'Evidence cannot exceed 2000 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Answered by user ID is required']
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: {
    transform: function(doc, ret) {
      ret.score = doc.score;
      ret.scorePercentage = doc.scorePercentage;
      ret.isCompliant = doc.isCompliant;
      ret.isPartiallyCompliant = doc.isPartiallyCompliant;
      ret.isNonCompliant = doc.isNonCompliant;
      return ret;
    }
  }
});

// Virtual for compliance score
answerSchema.virtual('score').get(function() {
  const complianceScores = {
    'compliant': 2,
    'partially-compliant': 1,
    'non-compliant': 0
  };
  return complianceScores[this.complianceStatus] || 0;
});

// Virtual for score percentage
answerSchema.virtual('scorePercentage').get(function() {
  return (this.score / 2) * 100; // Convert to percentage (max 2 points)
});

// Virtual for checking if compliant
answerSchema.virtual('isCompliant').get(function() {
  return this.complianceStatus === 'compliant';
});

// Virtual for checking if partially compliant
answerSchema.virtual('isPartiallyCompliant').get(function() {
  return this.complianceStatus === 'partially-compliant';
});

// Virtual for checking if non-compliant
answerSchema.virtual('isNonCompliant').get(function() {
  return this.complianceStatus === 'non-compliant';
});

// Indexes for better query performance
answerSchema.index({ auditId: 1 });
answerSchema.index({ questionId: 1 });
answerSchema.index({ complianceStatus: 1 });
answerSchema.index({ answeredBy: 1 });
answerSchema.index({ auditId: 1, questionId: 1 });
answerSchema.index({ auditId: 1, complianceStatus: 1 });

// Compound index for answer tracking
answerSchema.index({ auditId: 1, questionId: 1 }, { unique: true });

// Static method to find answers by audit
answerSchema.statics.findByAudit = function(auditId) {
  return this.find({ auditId }).populate('questionId', 'text weight');
};

// Static method to find answers by question
answerSchema.statics.findByQuestion = function(questionId) {
  return this.find({ questionId }).populate('auditId', 'status');
};

// Static method to find answers by compliance status
answerSchema.statics.findByComplianceStatus = function(status) {
  return this.find({ complianceStatus: status });
};

// Static method to find answers by user
answerSchema.statics.findByUser = function(userId) {
  return this.find({ answeredBy: userId });
};

// Static method to calculate audit score
answerSchema.statics.calculateAuditScore = async function(auditId) {
  const answers = await this.find({ auditId }).populate('questionId', 'weight');
  
  let totalWeight = 0;
  let weightedScore = 0;
  
  answers.forEach(answer => {
    const weight = answer.questionId.weight || 1;
    totalWeight += weight;
    weightedScore += (answer.score * weight);
  });
  
  if (totalWeight === 0) return 0;
  
  // Convert to percentage (max score per question is 2)
  return Math.round((weightedScore / (totalWeight * 2)) * 100);
};

// Instance method to update compliance status
answerSchema.methods.updateComplianceStatus = function(newStatus) {
  if (['compliant', 'partially-compliant', 'non-compliant'].includes(newStatus)) {
    this.complianceStatus = newStatus;
    this.answeredAt = new Date();
    return this.save();
  }
  throw new Error('Invalid compliance status');
};

// Instance method to add evidence
answerSchema.methods.addEvidence = function(evidence) {
  if (evidence && evidence.length <= 2000) {
    this.evidence = evidence.trim();
    this.answeredAt = new Date();
    return this.save();
  }
  throw new Error('Evidence must be provided and cannot exceed 2000 characters');
};

// Instance method to add notes
answerSchema.methods.addNotes = function(notes) {
  if (notes && notes.length <= 1000) {
    this.notes = notes.trim();
    this.answeredAt = new Date();
    return this.save();
  }
  throw new Error('Notes cannot exceed 1000 characters');
};

// Pre-save middleware to validate audit exists
answerSchema.pre('save', async function(next) {
  try {
    const Audit = mongoose.model('Audit');
    const audit = await Audit.findById(this.auditId);
    if (!audit) {
      throw new Error('Audit not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to validate question exists
answerSchema.pre('save', async function(next) {
  try {
    const Question = mongoose.model('Question');
    const question = await Question.findById(this.questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to validate user exists
answerSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(this.answeredBy);
    if (!user) {
      throw new Error('User not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Answer', answerSchema);
