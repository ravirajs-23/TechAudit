const SectionModel = require('../database/models/SectionModel');
const Section = require('../../domain/entities/Section');

class SectionRepository {
  /**
   * Create a new section
   * @param {Object} sectionData
   * @returns {Promise<Section>}
   */
  async create(sectionData) {
    try {
      const section = new Section(
        null,
        sectionData.title,
        sectionData.description,
        sectionData.weight
        // Questions are optional - can be added later via linking
      );

      const validationErrors = section.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Section validation failed: ${validationErrors.join(', ')}`);
      }

      const sectionDoc = new SectionModel({
        title: section.title,
        description: section.description,
        weight: section.weight
        // No questions required at creation time
      });

      const savedSection = await sectionDoc.save();
      
      return new Section(
        savedSection._id.toString(),
        savedSection.title,
        savedSection.description,
        savedSection.weight,
        savedSection.createdAt,
        savedSection.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to create section: ${error.message}`);
    }
  }

  /**
   * Find section by ID
   * @param {string} id
   * @returns {Promise<Section|null>}
   */
  async findById(id) {
    try {
      const sectionDoc = await SectionModel.findById(id);
      if (!sectionDoc) return null;

      return new Section(
        sectionDoc._id.toString(),
        sectionDoc.title,
        sectionDoc.description,
        sectionDoc.weight,
        sectionDoc.createdAt,
        sectionDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to find section: ${error.message}`);
    }
  }

  /**
   * Find all sections
   * @returns {Promise<Section[]>}
   */
  async findAll() {
    try {
      const sectionDocs = await SectionModel.find().sort({ createdAt: -1 });
      
      return sectionDocs.map(doc => new Section(
        doc._id.toString(),
        doc.title,
        doc.description,
        doc.weight,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find sections: ${error.message}`);
    }
  }

  /**
   * Update a section
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Section|null>}
   */
  async update(id, updateData) {
    try {
      const sectionDoc = await SectionModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!sectionDoc) return null;

      return new Section(
        sectionDoc._id.toString(),
        sectionDoc.title,
        sectionDoc.description,
        sectionDoc.weight,
        sectionDoc.createdAt,
        sectionDoc.updatedAt
      );
    } catch (error) {
      throw new Error(`Failed to update section: ${error.message}`);
    }
  }

  /**
   * Delete a section
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const result = await SectionModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete section: ${error.message}`);
    }
  }

  /**
   * Find sections by questionnaire ID
   * @param {string} questionnaireId
   * @returns {Promise<Section[]>}
   */
  async findByQuestionnaire(questionnaireId) {
    try {
      const sectionDocs = await SectionModel.find({ questionnaireId: questionnaireId }).sort({ createdAt: -1 });
      
      return sectionDocs.map(doc => new Section(
        doc._id.toString(),
        doc.title,
        doc.description,
        doc.weight,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find sections by questionnaire: ${error.message}`);
    }
  }

  /**
   * Add questions to a section
   * @param {string} sectionId
   * @param {string[]} questionIds
   * @returns {Promise<Object>}
   */
  async addQuestions(sectionId, questionIds) {
    try {
      // Verify section exists
      const section = await this.findById(sectionId);
      if (!section) {
        throw new Error('Section not found');
      }

      // Update all questions to link them to this section
      const QuestionModel = require('../database/models/QuestionModel');
      const updateResult = await QuestionModel.updateMany(
        { _id: { $in: questionIds } },
        { sectionId: sectionId }
      );

      return {
        sectionId,
        questionIds,
        updatedCount: updateResult.modifiedCount,
        message: `Successfully linked ${updateResult.modifiedCount} questions to section`
      };
    } catch (error) {
      throw new Error(`Failed to add questions to section: ${error.message}`);
    }
  }

  /**
   * Find sections by weight range
   * @param {number} minWeight
   * @param {number} maxWeight
   * @returns {Promise<Section[]>}
   */
  async findByWeightRange(minWeight, maxWeight) {
    try {
      const sectionDocs = await SectionModel.findByWeightRange(minWeight, maxWeight);
      
      return sectionDocs.map(doc => new Section(
        doc._id.toString(),
        doc.title,
        doc.description,
        doc.weight,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find sections by weight range: ${error.message}`);
    }
  }

  /**
   * Find high priority sections
   * @param {number} threshold
   * @returns {Promise<Section[]>}
   */
  async findHighPrioritySections(threshold = 8) {
    try {
      const sectionDocs = await SectionModel.findHighPrioritySections(threshold);
      
      return sectionDocs.map(doc => new Section(
        doc._id.toString(),
        doc.title,
        doc.description,
        doc.weight,
        doc.createdAt,
        doc.updatedAt
      ));
    } catch (error) {
      throw new Error(`Failed to find high priority sections: ${error.message}`);
    }
  }

  /**
   * Count total sections
   * @returns {Promise<number>}
   */
  async count() {
    try {
      return await SectionModel.countDocuments();
    } catch (error) {
      throw new Error(`Failed to count sections: ${error.message}`);
    }
  }
}

module.exports = SectionRepository;

