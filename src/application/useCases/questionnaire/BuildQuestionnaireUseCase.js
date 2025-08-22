const Question = require('../../../domain/entities/Question');
const Section = require('../../../domain/entities/Section');
const Questionnaire = require('../../../domain/entities/Questionnaire');
const Technology = require('../../../domain/entities/Technology');

class BuildQuestionnaireUseCase {
  constructor(questionRepository, sectionRepository, questionnaireRepository, technologyRepository) {
    this.questionRepository = questionRepository;
    this.sectionRepository = sectionRepository;
    this.questionnaireRepository = questionnaireRepository;
    this.technologyRepository = technologyRepository;
  }

  /**
   * Step 1: Create individual questions
   */
  async createQuestion(questionData) {
    try {
      // Validate question data
      const question = new Question(
        null,
        questionData.sectionId,
        questionData.text,
        questionData.guidance,
        questionData.evidenceRequired,
        questionData.weight,
        questionData.order
      );

      const validationErrors = question.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Question validation failed: ${validationErrors.join(', ')}`);
      }

      // Save question to database
      const savedQuestion = await this.questionRepository.create(question);
      
      return {
        success: true,
        question: savedQuestion,
        message: 'Question created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Step 2: Create sections and assign questions
   */
  async createSectionWithQuestions(sectionData, questionsData) {
    try {
      // Validate section data
      const section = new Section(
        null,
        sectionData.questionnaireId,
        sectionData.title,
        sectionData.description,
        sectionData.weight,
        sectionData.order
      );

      const validationErrors = section.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Section validation failed: ${validationErrors.join(', ')}`);
      }

      // Save section to database
      const savedSection = await this.sectionRepository.create(section);

      // Create and assign questions to this section
      const createdQuestions = [];
      for (const questionData of questionsData) {
        questionData.sectionId = savedSection.id;
        const questionResult = await this.createQuestion(questionData);
        
        if (questionResult.success) {
          createdQuestions.push(questionResult.question);
        } else {
          throw new Error(`Failed to create question: ${questionResult.error}`);
        }
      }

      return {
        success: true,
        section: savedSection,
        questions: createdQuestions,
        message: 'Section with questions created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Step 3: Create questionnaire and assign sections
   */
  async createQuestionnaireWithSections(questionnaireData, sectionsData) {
    try {
      // Validate questionnaire data
      const questionnaire = new Questionnaire(
        null,
        questionnaireData.technologyId,
        questionnaireData.version,
        questionnaireData.title,
        questionnaireData.description
      );

      const validationErrors = questionnaire.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Questionnaire validation failed: ${validationErrors.join(', ')}`);
      }

      // Save questionnaire to database
      const savedQuestionnaire = await this.questionnaireRepository.create(questionnaire);

      // Create sections and assign them to this questionnaire
      const createdSections = [];
      for (const sectionData of sectionsData) {
        sectionData.questionnaireId = savedQuestionnaire.id;
        const sectionResult = await this.createSectionWithQuestions(sectionData, sectionData.questions || []);
        
        if (sectionResult.success) {
          createdSections.push(sectionResult.section);
        } else {
          throw new Error(`Failed to create section: ${sectionResult.error}`);
        }
      }

      return {
        success: true,
        questionnaire: savedQuestionnaire,
        sections: createdSections,
        message: 'Questionnaire with sections created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Step 4: Create technology and assign questionnaire
   */
  async createTechnologyWithQuestionnaire(technologyData, questionnaireData, sectionsData) {
    try {
      // Validate technology data
      const technology = new Technology(
        null,
        technologyData.projectId,
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

      // Save technology to database
      const savedTechnology = await this.technologyRepository.create(technology);

      // Create questionnaire and assign it to this technology
      questionnaireData.technologyId = savedTechnology.id;
      const questionnaireResult = await this.createQuestionnaireWithSections(questionnaireData, sectionsData);

      if (!questionnaireResult.success) {
        throw new Error(`Failed to create questionnaire: ${questionnaireResult.error}`);
      }

      return {
        success: true,
        technology: savedTechnology,
        questionnaire: questionnaireResult.questionnaire,
        sections: questionnaireResult.sections,
        message: 'Technology with questionnaire created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reuse existing sections for a new questionnaire
   */
  async createQuestionnaireWithExistingSections(questionnaireData, existingSectionIds) {
    try {
      // Validate questionnaire data
      const questionnaire = new Questionnaire(
        null,
        questionnaireData.technologyId,
        questionnaireData.version,
        questionnaireData.title,
        questionnaireData.description
      );

      const validationErrors = questionnaire.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Questionnaire validation failed: ${validationErrors.join(', ')}`);
      }

      // Save questionnaire to database
      const savedQuestionnaire = await this.questionnaireRepository.create(questionnaire);

      // Link existing sections to this questionnaire (copy them)
      const linkedSections = [];
      for (const sectionId of existingSectionIds) {
        const existingSection = await this.sectionRepository.findById(sectionId);
        if (!existingSection) {
          throw new Error(`Section with ID ${sectionId} not found`);
        }

        // Create a copy of the section for this questionnaire
        const sectionCopy = {
          questionnaireId: savedQuestionnaire.id,
          title: existingSection.title,
          description: existingSection.description,
          weight: existingSection.weight,
          order: existingSection.order
        };

        const sectionResult = await this.sectionRepository.create(sectionCopy);
        if (sectionResult.success) {
          linkedSections.push(sectionResult.section);
        } else {
          throw new Error(`Failed to copy section: ${sectionResult.error}`);
        }
      }

      return {
        success: true,
        questionnaire: savedQuestionnaire,
        sections: linkedSections,
        message: 'Questionnaire created with existing sections successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get complete questionnaire structure
   */
  async getQuestionnaireStructure(questionnaireId) {
    try {
      const questionnaire = await this.questionnaireRepository.findById(questionnaireId);
      if (!questionnaire) {
        throw new Error('Questionnaire not found');
      }

      const sections = await this.sectionRepository.findByQuestionnaire(questionnaireId);
      const completeStructure = [];

      for (const section of sections) {
        const questions = await this.questionRepository.findBySection(section.id);
        completeStructure.push({
          section: section,
          questions: questions
        });
      }

      return {
        success: true,
        questionnaire: questionnaire,
        structure: completeStructure,
        message: 'Questionnaire structure retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = BuildQuestionnaireUseCase;
