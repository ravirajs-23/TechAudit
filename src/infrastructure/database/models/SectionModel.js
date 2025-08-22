const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true,
    maxlength: [200, 'Section title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Section description cannot exceed 1000 characters']
  },
  weight: {
    type: Number,
    min: [1, 'Section weight must be at least 1'],
    max: [10, 'Section weight cannot exceed 10'],
    default: 1
  },
  questionnaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
    required: false // Optional for standalone sections
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
sectionSchema.index({ title: 'text' }); // Text search index
sectionSchema.index({ weight: 1 }); // Weight index
sectionSchema.index({ createdAt: -1 }); // Creation date index

// Virtuals
sectionSchema.virtual('isHighPriority').get(function() {
  return this.weight >= 8;
});

sectionSchema.virtual('isMediumPriority').get(function() {
  return this.weight >= 5 && this.weight < 8;
});

sectionSchema.virtual('isLowPriority').get(function() {
  return this.weight < 5;
});

sectionSchema.virtual('summary').get(function() {
  const title = this.title.length > 50 ? this.title.substring(0, 50) + '...' : this.title;
  return `${title} [Weight: ${this.weight}]`;
});

// Static methods
sectionSchema.statics.findByWeightRange = function(minWeight, maxWeight) {
  return this.find({ weight: { $gte: minWeight, $lte: maxWeight } });
};

sectionSchema.statics.findHighPrioritySections = function(threshold = 8) {
  return this.find({ weight: { $gte: threshold } });
};

sectionSchema.statics.findByTitle = function(searchTitle) {
  return this.find({ title: new RegExp(searchTitle, 'i') });
};

sectionSchema.statics.getWeightDistribution = function() {
  return this.aggregate([
    { $group: { _id: '$weight', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
};

// Instance methods
sectionSchema.methods.updateSection = function(updateData) {
  if (updateData.title !== undefined) this.title = updateData.title;
  if (updateData.description !== undefined) this.description = updateData.description;
  if (updateData.weight !== undefined) this.weight = updateData.weight;
  return this.save();
};

sectionSchema.methods.getFormattedTitle = function() {
  return this.title.charAt(0).toUpperCase() + this.title.slice(1);
};

// Pre-save middleware
sectionSchema.pre('save', function(next) {
  // Ensure title is properly formatted
  if (this.title) {
    this.title = this.title.trim();
  }
  
  // Ensure description is properly formatted
  if (this.description) {
    this.description = this.description.trim();
  }
  
  next();
});

// Pre-update middleware
sectionSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const SectionModel = mongoose.model('Section', sectionSchema);

module.exports = SectionModel;

