const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Technology name is required'],
    trim: true,
    maxlength: [100, 'Technology name cannot exceed 100 characters']
  },
  version: {
    type: String,
    required: [true, 'Technology version is required'],
    trim: true,
    maxlength: [50, 'Technology version cannot exceed 50 characters']
  },
  vendor: {
    type: String,
    trim: true,
    maxlength: [100, 'Vendor name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Technology category is required'],
    trim: true,
    maxlength: [50, 'Technology category cannot exceed 50 characters']
  },
  riskLevel: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Risk level must be one of: low, medium, high, critical'
    },
    default: 'medium'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Technology description cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
technologySchema.index({ name: 'text', description: 'text' }); // Text search index
technologySchema.index({ category: 1 }); // Category index
technologySchema.index({ riskLevel: 1 }); // Risk level index
technologySchema.index({ vendor: 1 }); // Vendor index
technologySchema.index({ createdAt: -1 }); // Creation date index
technologySchema.index({ name: 1, version: 1 }); // Compound index for name + version

// Virtuals
technologySchema.virtual('fullName').get(function() {
  return `${this.name} ${this.version}`;
});

technologySchema.virtual('riskScore').get(function() {
  const riskScores = { low: 1, medium: 2, high: 3, critical: 4 };
  return riskScores[this.riskLevel] || 2;
});

technologySchema.virtual('isHighRisk').get(function() {
  return this.riskLevel === 'high' || this.riskLevel === 'critical';
});

technologySchema.virtual('isCriticalRisk').get(function() {
  return this.riskLevel === 'critical';
});

technologySchema.virtual('summary').get(function() {
  const name = this.name.length > 30 ? this.name.substring(0, 30) + '...' : this.name;
  return `${name} ${this.version} [${this.riskLevel} risk]`;
});

// Static methods
technologySchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

technologySchema.statics.findByRiskLevel = function(riskLevel) {
  return this.find({ riskLevel: riskLevel });
};

technologySchema.statics.findByVendor = function(vendor) {
  return this.find({ vendor: new RegExp(vendor, 'i') });
};

technologySchema.statics.findHighRiskTechnologies = function() {
  return this.find({ riskLevel: { $in: ['high', 'critical'] } });
};

technologySchema.statics.searchByText = function(searchText) {
  return this.find({ $text: { $search: searchText } });
};

technologySchema.statics.getRiskLevelDistribution = function() {
  return this.aggregate([
    { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

technologySchema.statics.getCategoryDistribution = function() {
  return this.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
technologySchema.methods.updateTechnology = function(updateData) {
  if (updateData.name !== undefined) this.name = updateData.name;
  if (updateData.version !== undefined) this.version = updateData.version;
  if (updateData.vendor !== undefined) this.vendor = updateData.vendor;
  if (updateData.category !== undefined) this.category = updateData.category;
  if (updateData.riskLevel !== undefined) this.riskLevel = updateData.riskLevel;
  if (updateData.description !== undefined) this.description = updateData.description;
  return this.save();
};

technologySchema.methods.getFormattedName = function() {
  return this.name.charAt(0).toUpperCase() + this.name.slice(1);
};

// Pre-save middleware
technologySchema.pre('save', function(next) {
  // Ensure name is properly formatted
  if (this.name) {
    this.name = this.name.trim();
  }
  
  // Ensure version is properly formatted
  if (this.version) {
    this.version = this.version.trim();
  }
  
  // Ensure vendor is properly formatted
  if (this.vendor) {
    this.vendor = this.vendor.trim();
  }
  
  // Ensure category is properly formatted
  if (this.category) {
    this.category = this.category.trim();
  }
  
  // Ensure description is properly formatted
  if (this.description) {
    this.description = this.description.trim();
  }
  
  next();
});

// Pre-update middleware
technologySchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const TechnologyModel = mongoose.model('Technology', technologySchema);

module.exports = TechnologyModel;
