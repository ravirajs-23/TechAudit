const QuestionnaireModel = require('../database/models/QuestionnaireModel');
const Questionnaire = require('../../domain/entities/Questionnaire');

class QuestionnaireRepository {
  /**
   * Create a new questionnaire
   * @param {Object} questionnaireData
   * @returns {Promise<Questionnaire>}
   */
  async create(questionnaireData) {
    try {
      const questionnaire = new Questionnaire(
        null,
        questionnaireData.title,
        questionnaireData.version,
        questionnaireData.description
      );

      const validationErrors = questionnaire.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Questionnaire validation failed: ${validationErrors.join(', ')}`);
      }

      const questionnaireDoc = new QuestionnaireModel({
        title: questionnaire.title,
        version: questionnaire.version,
        description: questionnaire.description
      });

      const savedQuestionnaire = await questionnaireDoc.save();
      
      return new Questionnaire(
        savedQuestionnaire._id.toString(),
        savedQuestionnaire.title,
        savedQuestionnaire.version,
        savedQuestionnaire.description,
        savedQuestionnaire.createdAt,
        savedQuestionnaire.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to create questionnaire: ${error.message}`);
    }
  }

  /**
   * Find questionnaire by ID
   * @param {string} id
   * @returns {Promise<Questionnaire|null>}
   */
  async findById(id) {
    try {
      const questionnaireDoc = await QuestionnaireModel.findById(id);
      if (!questionnaireDoc) return null;

      return new Questionnaire(
        questionnaireDoc._id.toString(),
        questionnaireDoc.title,
        questionnaireDoc.version,
        questionnaireDoc.description,
        questionnaireDoc.createdAt,
        questionnaireDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to find questionnaire: ${error.message}`);
    }
  }

  /**
   * Find all questionnaires
   * @returns {Promise<Questionnaire[]>}
   */
  async findAll() {
    try {
      const questionnaireDocs = await QuestionnaireModel.find().sort({ createdAt: -1 });
      
      return questionnaireDocs.map(doc => new Questionnaire(
        doc._id.toString(),
        doc.title,
        doc.version,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questionnaires: ${error.message}`);
    }
  }

  /**
   * Update a questionnaire
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Questionnaire|null>}
   */
  async update(id, updateData) {
    try {
      const questionnaireDoc = await QuestionnaireModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!questionnaireDoc) return null;

      return new Questionnaire(
        questionnaireDoc._id.toString(),
        questionnaireDoc.title,
        questionnaireDoc.version,
        questionnaireDoc.description,
        questionnaireDoc.createdAt,
        questionnaireDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to update questionnaire: ${error.message}`);
    }
  }

  /**
   * Delete a questionnaire
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const result = await QuestionnaireModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete questionnaire: ${error.message}`);
    }
  }

  /**
   * Find questionnaires by technology ID
   * @param {string} technologyId
   * @returns {Promise<Questionnaire[]>}
   */
  async findByTechnology(technologyId) {
    try {
      const questionnaireDocs = await QuestionnaireModel.find({ technologyId: technologyId }).sort({ createdAt: -1 });
      
      return questionnaireDocs.map(doc => new Questionnaire(
        doc._id.toString(),
        doc.title,
        doc.version,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questionnaires by technology: ${error.message}`);
    }
  }

  /**
   * Add sections to a questionnaire
   * @param {string} questionnaireId
   * @param {string[]} sectionIds
   * @returns {Promise<Object>}
   */
  async addSections(questionnaireId, sectionIds) {
    try {
      // Verify questionnaire exists
      const questionnaire = await this.findById(questionnaireId);
      if (!questionnaire) {
        throw new Error('Questionnaire not found');
      }

      // Update all sections to link them to this questionnaire
      const SectionModel = require('../database/models/SectionModel');
      const updateResult = await SectionModel.updateMany(
        { _id: { $in: sectionIds } },
        { questionnaireId: questionnaireId }
      );

      return {
        questionnaireId,
        sectionIds,
        updatedCount: updateResult.modifiedCount,
        message: `Successfully linked ${updateResult.modifiedCount} sections to questionnaire`
      };
    } catch (error) {
      throw new Error(`Failed to add sections to questionnaire: ${error.message}`);
    }
  }

  /**
   * Find questionnaires by title
   * @param {string} searchTitle
   * @returns {Promise<Questionnaire[]>}
   */
  async findByTitle(searchTitle) {
    try {
      const questionnaireDocs = await QuestionnaireModel.findByTitle(searchTitle);
      
      return questionnaireDocs.map(doc => new Questionnaire(
        doc._id.toString(),
        doc.title,
        doc.version,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questionnaires by title: ${error.message}`);
    }
  }

  /**
   * Find questionnaires by version
   * @param {string} version
   * @returns {Promise<Questionnaire[]>}
   */
  async findByVersion(version) {
    try {
      const questionnaireDocs = await QuestionnaireModel.findByVersion(version);
      
      return questionnaireDocs.map(doc => new Questionnaire(
        doc._id.toString(),
        doc.title,
        doc.version,
        doc.description,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questionnaires by version: ${error.message}`);
    }
  }

  /**
   * Find latest version of a questionnaire
   * @param {string} title
   * @returns {Promise<Questionnaire|null>}
   */
  async findLatestVersion(title) {
    try {
      const questionnaireDoc = await QuestionnaireModel.findLatestVersion(title);
      if (!questionnaireDoc) return null;

      return new Questionnaire(
        questionnaireDoc._id.toString(),
        questionnaireDoc.title,
        questionnaireDoc.version,
        questionnaireDoc.description,
        questionnaireDoc.createdAt,
        questionnaireDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to find latest version: ${error.message}`);
    }
  }

  /**
   * Count total questionnaires
   * @returns {Promise<number>}
   */
  async count() {
    try {
      return await QuestionnaireModel.countDocuments();
    } catch (error) {
      throw new Error(`Failed to count questionnaires: ${error.message}`);
    }
  }
}

module.exports = QuestionnaireRepository;

