const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [1000, 'Question text cannot exceed 1000 characters']
  },
  guidance: {
    type: String,
    trim: true,
    maxlength: [2000, 'Guidance cannot exceed 2000 characters']
  },
  evidenceRequired: {
    type: String,
    required: [true, 'Evidence requirement is required'],
    enum: {
      values: ['Yes', 'No', 'Optional'],
      message: 'Evidence required must be one of: Yes, No, Optional'
    }
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: false, // Optional - questions can exist without sections
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
questionSchema.index({ text: 'text' }); // Text search index
questionSchema.index({ evidenceRequired: 1 }); // Evidence requirement index
questionSchema.index({ createdAt: -1 }); // Creation date index

// Virtuals
questionSchema.virtual('isEvidenceRequired').get(function() {
  return this.evidenceRequired === 'Yes';
});

questionSchema.virtual('isEvidenceOptional').get(function() {
  return this.evidenceRequired === 'Optional';
});

questionSchema.virtual('isNoEvidenceNeeded').get(function() {
  return this.evidenceRequired === 'No';
});

questionSchema.virtual('summary').get(function() {
  const text = this.text.length > 100 ? this.text.substring(0, 100) + '...' : this.text;
  return `${text} [Evidence: ${this.evidenceRequired}]`;
});

// Static methods
questionSchema.statics.findByEvidenceRequirement = function(requirement) {
  return this.find({ evidenceRequired: requirement });
};

questionSchema.statics.findByText = function(searchText) {
  return this.find({ $text: { $search: searchText } });
};

questionSchema.statics.getEvidenceRequirementStats = function() {
  return this.aggregate([
    { $group: { _id: '$evidenceRequired', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
questionSchema.methods.updateQuestion = function(updateData) {
  if (updateData.text !== undefined) this.text = updateData.text;
  if (updateData.guidance !== undefined) this.guidance = updateData.guidance;
  if (updateData.evidenceRequired !== undefined) this.evidenceRequired = updateData.evidenceRequired;
  return this.save();
};

questionSchema.methods.getFormattedText = function() {
  return this.text.charAt(0).toUpperCase() + this.text.slice(1);
};

// Pre-save middleware
questionSchema.pre('save', function(next) {
  // Ensure text is properly formatted
  if (this.text) {
    this.text = this.text.trim();
  }
  
  // Ensure guidance is properly formatted
  if (this.guidance) {
    this.guidance = this.guidance.trim();
  }
  
  next();
});

// Pre-update middleware
questionSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;

