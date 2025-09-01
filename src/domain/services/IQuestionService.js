/**
 * Question Service Interface
 * Business logic के लिए interface definition
 */
class IQuestionService {
  /**
   * नया question create करना
   * @param {Object} questionData - Question data
   * @returns {Promise<Question>}
   */
  async createQuestion(questionData) {
    throw new Error('createQuestion method must be implemented');
  }

  /**
   * Question को ID से खोजना
   * @param {string} id - Question ID
   * @returns {Promise<Question|null>}
   */
  async getQuestionById(id) {
    throw new Error('getQuestionById method must be implemented');
  }

  /**
   * सभी questions get करना
   * @returns {Promise<Question[]>}
   */
  async getAllQuestions() {
    throw new Error('getAllQuestions method must be implemented');
  }

  /**
   * Question को update करना
   * @param {string} id - Question ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Question|null>}
   */
  async updateQuestion(id, updateData) {
    throw new Error('updateQuestion method must be implemented');
  }

  /**
   * Question को delete करना
   * @param {string} id - Question ID
   * @returns {Promise<boolean>}
   */
  async deleteQuestion(id) {
    throw new Error('deleteQuestion method must be implemented');
  }

  /**
   * Section के हिसाब से questions खोजना
   * @param {string} sectionId - Section ID
   * @returns {Promise<Question[]>}
   */
  async getQuestionsBySection(sectionId) {
    throw new Error('getQuestionsBySection method must be implemented');
  }

  /**
   * Standalone questions (बिना section के) get करना
   * @returns {Promise<Question[]>}
   */
  async getStandaloneQuestions() {
    throw new Error('getStandaloneQuestions method must be implemented');
  }

  /**
   * Questions को section से unlink करना
   * @param {string[]} questionIds - Question IDs array
   * @returns {Promise<Object>}
   */
  async unlinkQuestionsFromSection(questionIds) {
    throw new Error('unlinkQuestionsFromSection method must be implemented');
  }

  /**
   * Evidence requirement के हिसाब से questions search करना
   * @param {string} evidenceRequired - Evidence requirement type
   * @returns {Promise<Question[]>}
   */
  async getQuestionsByEvidenceRequirement(evidenceRequired) {
    throw new Error('getQuestionsByEvidenceRequirement method must be implemented');
  }

  /**
   * Text के हिसाब से questions search करना
   * @param {string} searchText - Search text
   * @returns {Promise<Question[]>}
   */
  async searchQuestionsByText(searchText) {
    throw new Error('searchQuestionsByText method must be implemented');
  }

  /**
   * Evidence requirement statistics get करना
   * @returns {Promise<Object>}
   */
  async getEvidenceRequirementStatistics() {
    throw new Error('getEvidenceRequirementStatistics method must be implemented');
  }

  /**
   * Total questions count करना
   * @returns {Promise<number>}
   */
  async getQuestionCount() {
    throw new Error('getQuestionCount method must be implemented');
  }

  /**
   * Question data को validate करना
   * @param {Object} questionData - Question data
   * @returns {Object} - Validation result
   */
  validateQuestionData(questionData) {
    throw new Error('validateQuestionData method must be implemented');
  }
}

module.exports = IQuestionService;
