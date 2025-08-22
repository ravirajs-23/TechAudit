const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Questionnaire title is required'],
    trim: true,
    maxlength: [200, 'Questionnaire title cannot exceed 200 characters']
  },
  version: {
    type: String,
    required: [true, 'Questionnaire version is required'],
    trim: true,
    maxlength: [50, 'Questionnaire version cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Questionnaire description cannot exceed 1000 characters']
  },
  technologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: false // Optional for standalone questionnaires
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
questionnaireSchema.index({ title: 'text' }); // Text search index
questionnaireSchema.index({ version: 1 }); // Version index
questionnaireSchema.index({ createdAt: -1 }); // Creation date index
questionnaireSchema.index({ title: 1, version: 1 }); // Compound index for title + version

// Virtuals
questionnaireSchema.virtual('fullTitle').get(function() {
  return `${this.title} v${this.version}`;
});

questionnaireSchema.virtual('summary').get(function() {
  const title = this.title.length > 50 ? this.title.substring(0, 50) + '...' : this.title;
  return `${title} [v${this.version}]`;
});

// Static methods
questionnaireSchema.statics.findByTitle = function(searchTitle) {
  return this.find({ title: new RegExp(searchTitle, 'i') });
};

questionnaireSchema.statics.findByVersion = function(version) {
  return this.find({ version: version });
};

questionnaireSchema.statics.findLatestVersion = function(title) {
  return this.findOne({ title: title }).sort({ version: -1 });
};

questionnaireSchema.statics.getVersionHistory = function(title) {
  return this.find({ title: title }).sort({ version: 1 });
};

questionnaireSchema.statics.searchByText = function(searchText) {
  return this.find({ $text: { $search: searchText } });
};

// Instance methods
questionnaireSchema.methods.updateQuestionnaire = function(updateData) {
  if (updateData.title !== undefined) this.title = updateData.title;
  if (updateData.version !== undefined) this.version = updateData.version;
  if (updateData.description !== undefined) this.description = updateData.description;
  return this.save();
};

questionnaireSchema.methods.getFormattedTitle = function() {
  return this.title.charAt(0).toUpperCase() + this.title.slice(1);
};

// Pre-save middleware
questionnaireSchema.pre('save', function(next) {
  // Ensure title is properly formatted
  if (this.title) {
    this.title = this.title.trim();
  }
  
  // Ensure version is properly formatted
  if (this.version) {
    this.version = this.version.trim();
  }
  
  // Ensure description is properly formatted
  if (this.description) {
    this.description = this.description.trim();
  }
  
  next();
});

// Pre-update middleware
questionnaireSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const QuestionnaireModel = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = QuestionnaireModel;

