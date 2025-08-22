const QuestionModel = require('../database/models/QuestionModel');
const Question = require('../../domain/entities/Question');

class QuestionRepository {
  /**
   * Create a new question
   * @param {Object} questionData
   * @returns {Promise<Question>}
   */
  async create(questionData) {
    try {
      const question = new Question(
        null,
        questionData.text,
        questionData.guidance,
        questionData.evidenceRequired
      );

      const validationErrors = question.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Question validation failed: ${validationErrors.join(', ')}`);
      }

      const questionDoc = new QuestionModel({
        text: question.text,
        guidance: question.guidance,
        evidenceRequired: question.evidenceRequired,
        sectionId: questionData.sectionId || null // Optional sectionId
      });

      const savedQuestion = await questionDoc.save();
      
      return new Question(
        savedQuestion._id.toString(),
        savedQuestion.text,
        savedQuestion.guidance,
        savedQuestion.evidenceRequired,
        savedQuestion.createdAt,
        savedQuestion.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to create question: ${error.message}`);
    }
  }

  /**
   * Find question by ID
   * @param {string} id
   * @returns {Promise<Question|null>}
   */
  async findById(id) {
    try {
      const questionDoc = await QuestionModel.findById(id);
      if (!questionDoc) return null;

      return new Question(
        questionDoc._id.toString(),
        questionDoc.text,
        questionDoc.guidance,
        questionDoc.evidenceRequired,
        questionDoc.createdAt,
        questionDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to find question: ${error.message}`);
    }
  }

  /**
   * Find all questions
   * @returns {Promise<Question[]>}
   */
  async findAll() {
    try {
      const questionDocs = await QuestionModel.find().sort({ createdAt: -1 });
      
      return questionDocs.map(doc => new Question(
        doc._id.toString(),
        doc.text,
        doc.guidance,
        doc.evidenceRequired,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questions: ${error.message}`);
    }
  }

  /**
   * Update a question
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Question|null>}
   */
  async update(id, updateData) {
    try {
      const questionDoc = await QuestionModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!questionDoc) return null;

      return new Question(
        questionDoc._id.toString(),
        questionDoc.text,
        questionDoc.guidance,
        questionDoc.evidenceRequired,
        questionDoc.createdAt,
        questionDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to update question: ${error.message}`);
    }
  }

  /**
   * Delete a question
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const result = await QuestionModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete question: ${error.message}`);
    }
  }

  /**
   * Unlink questions from a section (make them standalone)
   * @param {string[]} questionIds
   * @returns {Promise<Object>}
   */
  async unlinkFromSection(questionIds) {
    try {
      const updateResult = await QuestionModel.updateMany(
        { _id: { $in: questionIds } },
        { sectionId: null }
      );

      return {
        questionIds,
        updatedCount: updateResult.modifiedCount,
        message: `Successfully unlinked ${updateResult.modifiedCount} questions from sections`
      };
    } catch (error) {
      throw new Error(`Failed to unlink questions from sections: ${error.message}`);
    }
  }

  /**
   * Find standalone questions (not linked to any section)
   * @returns {Promise<Question[]>}
   */
  async findStandaloneQuestions() {
    try {
      const questionDocs = await QuestionModel.find({ sectionId: null }).sort({ createdAt: -1 });
      
      return questionDocs.map(doc => new Question(
        doc._id.toString(),
        doc.text,
        doc.guidance,
        doc.evidenceRequired,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find standalone questions: ${error.message}`);
    }
  }

  /**
   * Find questions by section ID
   * @param {string} sectionId
   * @returns {Promise<Question[]>}
   */
  async findBySection(sectionId) {
    try {
      const questionDocs = await QuestionModel.find({ sectionId: sectionId }).sort({ createdAt: -1 });
      
      return questionDocs.map(doc => new Question(
        doc._id.toString(),
        doc.text,
        doc.guidance,
        doc.evidenceRequired,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questions by section: ${error.message}`);
    }
  }

  /**
   * Find questions by evidence requirement
   * @param {string} evidenceRequired
   * @returns {Promise<Question[]>}
   */
  async findByEvidenceRequirement(evidenceRequired) {
    try {
      const questionDocs = await QuestionModel.findByEvidenceRequirement(evidenceRequired);
      
      return questionDocs.map(doc => new Question(
        doc._id.toString(),
        doc.text,
        doc.guidance,
        doc.evidenceRequired,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find questions by evidence requirement: ${error.message}`);
    }
  }

  /**
   * Search questions by text
   * @param {string} searchText
   * @returns {Promise<Question[]>}
   */
  async findByText(searchText) {
    try {
      const questionDocs = await QuestionModel.findByText(searchText);
      
      return questionDocs.map(doc => new Question(
        doc._id.toString(),
        doc.text,
        doc.guidance,
        doc.evidenceRequired,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to search questions: ${error.message}`);
    }
  }

  /**
   * Get evidence requirement statistics
   * @returns {Promise<Object>}
   */
  async getEvidenceRequirementStats() {
    try {
      return await QuestionModel.getEvidenceRequirementStats();
    } catch (error) {
      throw new Error(`Failed to get evidence requirement stats: ${error.message}`);
    }
  }

  /**
   * Count total questions
   * @returns {Promise<number>}
   */
  async count() {
    try {
      return await QuestionModel.countDocuments();
    } catch (error) {
      throw new Error(`Failed to count questions: ${error.message}`);
    }
  }
}

module.exports = QuestionRepository;
