const TechnologyModel = require('../database/models/TechnologyModel');
const Technology = require('../../domain/entities/Technology');

class TechnologyRepository {
  /**
   * Create a new technology
   * @param {Object} technologyData
   * @returns {Promise<Technology>}
   */
  async create(technologyData) {
    try {
      const technology = new Technology(
        null,
        technologyData.name,
        technologyData.version,
        technologyData.vendor,
        technologyData.category,
        technologyData.riskLevel,
        technologyData.description
      );

      const validationErrors = technology.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Technology validation failed: ${validationErrors.join(', ')}`);
      }

      const technologyDoc = new TechnologyModel({
        name: technology.name,
        version: technology.version,
        vendor: technology.vendor,
        category: technology.category,
        riskLevel: technology.riskLevel,
        description: technology.description
      });

      const savedTechnology = await technologyDoc.save();
      
      return new Technology(
        savedTechnology._id.toString(),
        savedTechnology.name,
        savedTechnology.version,
        savedTechnology.vendor,
        savedTechnology.category,
        savedTechnology.riskLevel,
        savedTechnology.description,
        savedTechnology.createdAt,
        savedTechnology.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to create technology: ${error.message}`);
    }
  }

  /**
   * Find technology by ID
   * @param {string} id
   * @returns {Promise<Technology|null>}
   */
  async findById(id) {
    try {
      const technologyDoc = await TechnologyModel.findById(id);
      if (!technologyDoc) return null;

      return new Technology(
        technologyDoc._id.toString(),
        technologyDoc.name,
        technologyDoc.version,
        technologyDoc.vendor,
        technologyDoc.category,
        technologyDoc.riskLevel,
        technologyDoc.description,
        technologyDoc.createdAt,
        technologyDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to find technology: ${error.message}`);
    }
  }

  /**
   * Find all technologies
   * @returns {Promise<Technology[]>}
   */
  async findAll() {
    try {
      const technologyDocs = await TechnologyModel.find().sort({ createdAt: -1 });
      
      return technologyDocs.map(doc => new Technology(
        doc._id.toString(),
        doc.name,
        doc.version,
        doc.vendor,
        doc.category,
        doc.riskLevel,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find technologies: ${error.message}`);
    }
  }

  /**
   * Update a technology
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Technology|null>}
   */
  async update(id, updateData) {
    try {
      const technologyDoc = await TechnologyModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!technologyDoc) return null;

      return new Technology(
        technologyDoc._id.toString(),
        technologyDoc.name,
        technologyDoc.version,
        technologyDoc.vendor,
        technologyDoc.category,
        technologyDoc.riskLevel,
        technologyDoc.description,
        technologyDoc.createdAt,
        technologyDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to update technology: ${error.message}`);
    }
  }

  /**
   * Delete a technology
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const result = await TechnologyModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete technology: ${error.message}`);
    }
  }

  /**
   * Link a questionnaire to a technology
   * @param {string} technologyId
   * @param {string} questionnaireId
   * @returns {Promise<Object>}
   */
  async linkQuestionnaire(technologyId, questionnaireId) {
    try {
      // Verify both technology and questionnaire exist
      const technology = await this.findById(technologyId);
      if (!technology) {
        throw new Error('Technology not found');
      }

      const QuestionnaireModel = require('../database/models/QuestionnaireModel');
      const questionnaire = await QuestionnaireModel.findById(questionnaireId);
      if (!questionnaire) {
        throw new Error('Questionnaire not found');
      }

      // Update the questionnaire to link it to this technology
      const updateResult = await QuestionnaireModel.findByIdAndUpdate(
        questionnaireId,
        { technologyId: technologyId },
        { new: true }
      );

      return {
        technologyId,
        questionnaireId,
        questionnaire: updateResult,
        message: 'Questionnaire successfully linked to technology'
      };
    } catch (error) {
      throw new Error(`Failed to link questionnaire to technology: ${error.message}`);
    }
  }

  /**
   * Find technologies by category
   * @param {string} category
   * @returns {Promise<Technology[]>}
   */
  async findByCategory(category) {
    try {
      const technologyDocs = await TechnologyModel.findByCategory(category);
      
      return technologyDocs.map(doc => new Technology(
        doc._id.toString(),
        doc.name,
        doc.version,
        doc.vendor,
        doc.category,
        doc.riskLevel,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find technologies by category: ${error.message}`);
    }
  }

  /**
   * Find technologies by risk level
   * @param {string} riskLevel
   * @returns {Promise<Technology[]>}
   */
  async findByRiskLevel(riskLevel) {
    try {
      const technologyDocs = await TechnologyModel.findByRiskLevel(riskLevel);
      
      return technologyDocs.map(doc => new Technology(
        doc._id.toString(),
        doc.name,
        doc.version,
        doc.vendor,
        doc.category,
        doc.riskLevel,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find technologies by risk level: ${error.message}`);
    }
  }

  /**
   * Find high-risk technologies
   * @returns {Promise<Technology[]>}
   */
  async findHighRiskTechnologies() {
    try {
      const technologyDocs = await TechnologyModel.findHighRiskTechnologies();
      
      return technologyDocs.map(doc => new Technology(
        doc._id.toString(),
        doc.name,
        doc.version,
        doc.vendor,
        doc.category,
        doc.riskLevel,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find high-risk technologies: ${error.message}`);
    }
  }

  /**
   * Count total technologies
   * @returns {Promise<number>}
   */
  async count() {
    try {
      return await TechnologyModel.countDocuments();
    } catch (error) {
      throw new Error(`Failed to count technologies: ${error.message}`);
    }
  }
}

module.exports = TechnologyRepository;

