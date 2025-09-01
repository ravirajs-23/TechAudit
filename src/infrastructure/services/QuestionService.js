const IQuestionService = require('../../domain/services/IQuestionService');
const Question = require('../../domain/entities/Question');

/**
 * Question Service Implementation
 * Question related business logic को handle करता है
 */
class QuestionService extends IQuestionService {
  /**
   * Constructor
   * @param {QuestionRepository} questionRepository - Question repository instance
   */
  constructor(questionRepository) {
    super();
    this.questionRepository = questionRepository;
  }

  /**
   * नया question create करना
   * @param {Object} questionData - Question data
   * @returns {Promise<Question>}
   */
  async createQuestion(questionData) {
    try {
      // Input validation
      const validationResult = this.validateQuestionData(questionData);
      if (!validationResult.isValid) {
        throw new Error(`Question validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Repository के through question create करना
      const question = await this.questionRepository.create(questionData);

      return question;
    } catch (error) {
      throw new Error(`Failed to create question: ${error.message}`);
    }
  }

  /**
   * Question को ID से खोजना
   * @param {string} id - Question ID
   * @returns {Promise<Question|null>}
   */
  async getQuestionById(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid question ID is required');
      }

      const question = await this.questionRepository.findById(id);
      return question;
    } catch (error) {
      throw new Error(`Failed to get question: ${error.message}`);
    }
  }

  /**
   * सभी questions get करना
   * @returns {Promise<Question[]>}
   */
  async getAllQuestions() {
    try {
      const questions = await this.questionRepository.findAll();
      return questions;
    } catch (error) {
      throw new Error(`Failed to get all questions: ${error.message}`);
    }
  }

  /**
   * Question को update करना
   * @param {string} id - Question ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Question|null>}
   */
  async updateQuestion(id, updateData) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid question ID is required');
      }

      // Check if question exists
      const existingQuestion = await this.questionRepository.findById(id);
      if (!existingQuestion) {
        throw new Error('Question not found');
      }

      // Validate update data
      const validationResult = this.validateQuestionData(updateData);
      if (!validationResult.isValid) {
        throw new Error(`Question validation failed: ${validationResult.errors.join(', ')}`);
      }

      const updatedQuestion = await this.questionRepository.update(id, updateData);
      return updatedQuestion;
    } catch (error) {
      throw new Error(`Failed to update question: ${error.message}`);
    }
  }

  /**
   * Question को delete करना
   * @param {string} id - Question ID
   * @returns {Promise<boolean>}
   */
  async deleteQuestion(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid question ID is required');
      }

      // Check if question exists
      const existingQuestion = await this.questionRepository.findById(id);
      if (!existingQuestion) {
        throw new Error('Question not found');
      }

      const result = await this.questionRepository.delete(id);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete question: ${error.message}`);
    }
  }

  /**
   * Section के हिसाब से questions खोजना
   * @param {string} sectionId - Section ID
   * @returns {Promise<Question[]>}
   */
  async getQuestionsBySection(sectionId) {
    try {
      if (!sectionId || typeof sectionId !== 'string') {
        throw new Error('Valid section ID is required');
      }

      const questions = await this.questionRepository.findBySection(sectionId);
      return questions;
    } catch (error) {
      throw new Error(`Failed to get questions by section: ${error.message}`);
    }
  }

  /**
   * Standalone questions (बिना section के) get करना
   * @returns {Promise<Question[]>}
   */
  async getStandaloneQuestions() {
    try {
      const questions = await this.questionRepository.findStandaloneQuestions();
      return questions;
    } catch (error) {
      throw new Error(`Failed to get standalone questions: ${error.message}`);
    }
  }

  /**
   * Questions को section से unlink करना
   * @param {string[]} questionIds - Question IDs array
   * @returns {Promise<Object>}
   */
  async unlinkQuestionsFromSection(questionIds) {
    try {
      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        throw new Error('Valid question IDs array is required');
      }

      // Validate question IDs
      for (const id of questionIds) {
        if (!id || typeof id !== 'string') {
          throw new Error('All question IDs must be valid strings');
        }
      }

      const result = await this.questionRepository.unlinkFromSection(questionIds);
      return result;
    } catch (error) {
      throw new Error(`Failed to unlink questions from section: ${error.message}`);
    }
  }

  /**
   * Evidence requirement के हिसाब से questions search करना
   * @param {string} evidenceRequired - Evidence requirement type
   * @returns {Promise<Question[]>}
   */
  async getQuestionsByEvidenceRequirement(evidenceRequired) {
    try {
      if (!evidenceRequired || typeof evidenceRequired !== 'string') {
        throw new Error('Valid evidence requirement is required');
      }

      const questions = await this.questionRepository.findByEvidenceRequirement(evidenceRequired);
      return questions;
    } catch (error) {
      throw new Error(`Failed to get questions by evidence requirement: ${error.message}`);
    }
  }

  /**
   * Text के हिसाब से questions search करना
   * @param {string} searchText - Search text
   * @returns {Promise<Question[]>}
   */
  async searchQuestionsByText(searchText) {
    try {
      if (!searchText || typeof searchText !== 'string' || searchText.trim().length === 0) {
        throw new Error('Valid search text is required');
      }

      const questions = await this.questionRepository.findByText(searchText.trim());
      return questions;
    } catch (error) {
      throw new Error(`Failed to search questions by text: ${error.message}`);
    }
  }

  /**
   * Evidence requirement statistics get करना
   * @returns {Promise<Object>}
   */
  async getEvidenceRequirementStatistics() {
    try {
      const stats = await this.questionRepository.getEvidenceRequirementStats();
      return stats;
    } catch (error) {
      throw new Error(`Failed to get evidence requirement statistics: ${error.message}`);
    }
  }

  /**
   * Total questions count करना
   * @returns {Promise<number>}
   */
  async getQuestionCount() {
    try {
      const count = await this.questionRepository.count();
      return count;
    } catch (error) {
      throw new Error(`Failed to get question count: ${error.message}`);
    }
  }

  /**
   * Question data को validate करना
   * @param {Object} questionData - Question data
   * @returns {Object} - Validation result
   */
  validateQuestionData(questionData) {
    const errors = [];

    if (!questionData) {
      errors.push('Question data is required');
      return { isValid: false, errors };
    }

    // Text validation
    if (!questionData.text || typeof questionData.text !== 'string' || questionData.text.trim().length === 0) {
      errors.push('Question text is required and must be a non-empty string');
    } else if (questionData.text.trim().length < 10) {
      errors.push('Question text must be at least 10 characters long');
    } else if (questionData.text.trim().length > 1000) {
      errors.push('Question text must not exceed 1000 characters');
    }

    // Guidance validation
    if (questionData.guidance !== undefined) {
      if (typeof questionData.guidance !== 'string') {
        errors.push('Guidance must be a string');
      } else if (questionData.guidance.length > 2000) {
        errors.push('Guidance must not exceed 2000 characters');
      }
    }

    // Evidence required validation
    if (!questionData.evidenceRequired || typeof questionData.evidenceRequired !== 'string') {
      errors.push('Evidence required is mandatory and must be a string');
    } else {
      const validEvidenceTypes = ['document', 'interview', 'observation', 'screenshot', 'log', 'other'];
      if (!validEvidenceTypes.includes(questionData.evidenceRequired.toLowerCase())) {
        errors.push(`Evidence required must be one of: ${validEvidenceTypes.join(', ')}`);
      }
    }

    // Section ID validation (optional)
    if (questionData.sectionId !== undefined && questionData.sectionId !== null) {
      if (typeof questionData.sectionId !== 'string' || questionData.sectionId.trim().length === 0) {
        errors.push('Section ID must be a valid string if provided');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Bulk questions create करना
   * @param {Array} questionsData - Array of question data
   * @returns {Promise<Object>}
   */
  async createBulkQuestions(questionsData) {
    try {
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        throw new Error('Valid questions data array is required');
      }

      const results = {
        created: [],
        failed: [],
        totalProcessed: questionsData.length
      };

      for (let i = 0; i < questionsData.length; i++) {
        try {
          const question = await this.createQuestion(questionsData[i]);
          results.created.push({
            index: i,
            question,
            originalData: questionsData[i]
          });
        } catch (error) {
          results.failed.push({
            index: i,
            error: error.message,
            originalData: questionsData[i]
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to create bulk questions: ${error.message}`);
    }
  }
}

module.exports = QuestionService;
