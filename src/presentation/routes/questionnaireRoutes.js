const express = require('express');
const router = express.Router();
const QuestionRepository = require('../../infrastructure/repositories/QuestionRepository');
const SectionRepository = require('../../infrastructure/repositories/SectionRepository');
const QuestionnaireRepository = require('../../infrastructure/repositories/QuestionnaireRepository');
const TechnologyRepository = require('../../infrastructure/repositories/TechnologyRepository');
const { authenticateToken, requireAuditorOrAdmin } = require('../middleware/auth');

// Initialize repositories
const questionRepository = new QuestionRepository();
const sectionRepository = new SectionRepository();
const questionnaireRepository = new QuestionnaireRepository();
const technologyRepository = new TechnologyRepository();

// Apply authentication to all routes
router.use(authenticateToken);

// ===== QUESTION MANAGEMENT =====

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Private (Admin/Auditor)
 */
router.post('/questions', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionData = {
      text: req.body.text,
      guidance: req.body.guidance,
      evidenceRequired: req.body.evidenceRequired
    };

    // Validate required fields
    if (!questionData.text || !questionData.evidenceRequired) {
      return res.status(400).json({
        success: false,
        error: 'Question text and evidence requirement are required'
      });
    }

    // Validate evidence requirement values
    const validEvidenceValues = ['Yes', 'No', 'Optional'];
    if (!validEvidenceValues.includes(questionData.evidenceRequired)) {
      return res.status(400).json({
        success: false,
        error: 'Evidence required must be one of: Yes, No, Optional'
      });
    }

    const question = await questionRepository.create(questionData);
    
    res.status(201).json({
      success: true,
      data: question,
      message: 'Question created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to create question: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questions
 * @desc    Get all questions
 * @access  Private
 */
router.get('/questions', async (req, res) => {
  try {
    const questions = await questionRepository.findAll();
    res.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch questions: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questions/:id
 * @desc    Get question by ID
 * @access  Private
 */
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await questionRepository.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch question: ${error.message}`
    });
  }
});

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question
 * @access  Private (Admin/Auditor)
 */
router.put('/questions/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionId = req.params.id;
    const updateData = {
      text: req.body.text,
      guidance: req.body.guidance,
      evidenceRequired: req.body.evidenceRequired
    };

    // Validate required fields
    if (!updateData.text || !updateData.evidenceRequired) {
      return res.status(400).json({
        success: false,
        error: 'Question text and evidence requirement are required'
      });
    }

    // Validate evidence requirement values
    const validEvidenceValues = ['Yes', 'No', 'Optional'];
    if (!validEvidenceValues.includes(updateData.evidenceRequired)) {
      return res.status(400).json({
        success: false,
        error: 'Evidence required must be one of: Yes, No, Optional'
      });
    }

    const updatedQuestion = await questionRepository.update(questionId, updateData);
    
    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: updatedQuestion,
      message: 'Question updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to update question: ${error.message}`
    });
  }
});

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question
 * @access  Private (Admin/Auditor)
 */
router.delete('/questions/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionId = req.params.id;
    const deleted = await questionRepository.delete(questionId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to delete question: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questions/standalone
 * @desc    Get standalone questions (not linked to any section)
 * @access  Private
 */
router.get('/questions/standalone', async (req, res) => {
  try {
    const questions = await questionRepository.findStandaloneQuestions();
    res.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch standalone questions: ${error.message}`
    });
  }
});

/**
 * @route   POST /api/questions/unlink
 * @desc    Unlink questions from sections (make them standalone)
 * @access  Private (Admin/Auditor)
 */
router.post('/questions/unlink', requireAuditorOrAdmin, async (req, res) => {
  try {
    const { questionIds } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question IDs array is required'
      });
    }

    const result = await questionRepository.unlinkFromSection(questionIds);
    
    res.json({
      success: true,
      data: result,
      message: 'Questions unlinked from sections successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to unlink questions: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questions/section/:sectionId
 * @desc    Get questions by section
 * @access  Private
 */
router.get('/questions/section/:sectionId', async (req, res) => {
  try {
    const questions = await questionRepository.findBySection(req.params.sectionId);
    res.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch questions by section: ${error.message}`
    });
  }
});

// ===== SECTION MANAGEMENT =====

/**
 * @route   POST /api/sections
 * @desc    Create a new section
 * @access  Private (Admin/Auditor)
 */
router.post('/sections', requireAuditorOrAdmin, async (req, res) => {
  try {
    const sectionData = {
      title: req.body.title,
      description: req.body.description,
      weight: req.body.weight || 1
      // Questions are optional - can be added later via linking
    };

    // Validate required fields
    if (!sectionData.title) {
      return res.status(400).json({
        success: false,
        error: 'Section title is required'
      });
    }

    // Validate weight range
    if (sectionData.weight < 1 || sectionData.weight > 10) {
      return res.status(400).json({
        success: false,
        error: 'Section weight must be between 1 and 10'
      });
    }

    const section = await sectionRepository.create(sectionData);
    
    res.status(201).json({
      success: true,
      data: section,
      message: 'Section created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to create section: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/sections
 * @desc    Get all sections
 * @access  Private
 */
router.get('/sections', async (req, res) => {
  try {
    const sections = await sectionRepository.findAll();
    res.json({
      success: true,
      data: sections,
      count: sections.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch sections: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/sections/:id
 * @desc    Get section by ID
 * @access  Private
 */
router.get('/sections/:id', async (req, res) => {
  try {
    const section = await sectionRepository.findById(req.params.id);
    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }
    
    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch section: ${error.message}`
    });
  }
});

/**
 * @route   PUT /api/sections/:id
 * @desc    Update a section
 * @access  Private (Admin/Auditor)
 */
router.put('/sections/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const sectionId = req.params.id;
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      weight: req.body.weight
    };

    // Validate required fields
    if (!updateData.title) {
      return res.status(400).json({
        success: false,
        error: 'Section title is required'
      });
    }

    // Validate weight range if provided
    if (updateData.weight && (updateData.weight < 1 || updateData.weight > 10)) {
      return res.status(400).json({
        success: false,
        error: 'Section weight must be between 1 and 10'
      });
    }

    const updatedSection = await sectionRepository.update(sectionId, updateData);
    
    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }

    res.json({
      success: true,
      data: updatedSection,
      message: 'Section updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to update section: ${error.message}`
    });
  }
});

/**
 * @route   DELETE /api/sections/:id
 * @desc    Delete a section
 * @access  Private (Admin/Auditor)
 */
router.delete('/sections/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const sectionId = req.params.id;
    const deleted = await sectionRepository.delete(sectionId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }

    res.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to delete section: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/sections/questionnaire/:questionnaireId
 * @desc    Get sections by questionnaire
 * @access  Private
 */
router.get('/sections/questionnaire/:questionnaireId', async (req, res) => {
  try {
    const sections = await sectionRepository.findByQuestionnaire(req.params.questionnaireId);
    res.json({
      success: true,
      data: sections,
      count: sections.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch sections by questionnaire: ${error.message}`
    });
  }
});

// ===== QUESTIONNAIRE MANAGEMENT =====

/**
 * @route   POST /api/questionnaires
 * @desc    Create a new questionnaire
 * @access  Private (Admin/Auditor)
 */
router.post('/questionnaires', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionnaireData = {
      title: req.body.title,
      version: req.body.version || '1.0',
      description: req.body.description
    };

    // Validate required fields
    if (!questionnaireData.title) {
      return res.status(400).json({
        success: false,
        error: 'Questionnaire title is required'
      });
    }

    const questionnaire = await questionnaireRepository.create(questionnaireData);
    
    res.status(201).json({
      success: true,
      data: questionnaire,
      message: 'Questionnaire created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to create questionnaire: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questionnaires
 * @desc    Get all questionnaires
 * @access  Private
 */
router.get('/questionnaires', async (req, res) => {
  try {
    const questionnaires = await questionnaireRepository.findAll();
    res.json({
      success: true,
      data: questionnaires,
      count: questionnaires.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch questionnaires: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questionnaires/:id
 * @desc    Get questionnaire by ID
 * @access  Private
 */
router.get('/questionnaires/:id', async (req, res) => {
  try {
    const questionnaire = await questionnaireRepository.findById(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        error: 'Questionnaire not found'
      });
    }
    
    res.json({
      success: true,
      data: questionnaire
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch questionnaire: ${error.message}`
    });
  }
});

/**
 * @route   PUT /api/questionnaires/:id
 * @desc    Update a questionnaire
 * @access  Private (Admin/Auditor)
 */
router.put('/questionnaires/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionnaireId = req.params.id;
    const updateData = {
      title: req.body.title,
      version: req.body.version,
      description: req.body.description
    };

    // Validate required fields
    if (!updateData.title) {
      return res.status(400).json({
        success: false,
        error: 'Questionnaire title is required'
      });
    }

    const updatedQuestionnaire = await questionnaireRepository.update(questionnaireId, updateData);
    
    if (!updatedQuestionnaire) {
      return res.status(404).json({
        success: false,
        error: 'Questionnaire not found'
      });
    }

    res.json({
      success: true,
      data: updatedQuestionnaire,
      message: 'Questionnaire updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to update questionnaire: ${error.message}`
    });
  }
});

/**
 * @route   DELETE /api/questionnaires/:id
 * @desc    Delete a questionnaire
 * @access  Private (Admin/Auditor)
 */
router.delete('/questionnaires/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionnaireId = req.params.id;
    const deleted = await questionnaireRepository.delete(questionnaireId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Questionnaire not found'
      });
    }

    res.json({
      success: true,
      message: 'Questionnaire deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to delete questionnaire: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/questionnaires/technology/:technologyId
 * @desc    Get questionnaires by technology
 * @access  Private
 */
router.get('/questionnaires/technology/:technologyId', async (req, res) => {
  try {
    const questionnaires = await questionnaireRepository.findByTechnology(req.params.technologyId);
    res.json({
      success: true,
      data: questionnaires,
      count: questionnaires.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch questionnaires by technology: ${error.message}`
    });
  }
});

// ===== TECHNOLOGY MANAGEMENT =====

/**
 * @route   POST /api/technologies
 * @desc    Create a new technology
 * @access  Private (Admin/Auditor)
 */
router.post('/technologies', requireAuditorOrAdmin, async (req, res) => {
  try {
    const technologyData = {
      name: req.body.name,
      version: req.body.version,
      vendor: req.body.vendor,
      category: req.body.category,
      riskLevel: req.body.riskLevel || 'medium',
      description: req.body.description
    };

    // Validate required fields
    if (!technologyData.name || !technologyData.category) {
      return res.status(400).json({
        success: false,
        error: 'Technology name and category are required'
      });
    }

    // Validate risk level
    const validRiskLevels = ['low', 'medium', 'high', 'critical'];
    if (!validRiskLevels.includes(technologyData.riskLevel)) {
      return res.status(400).json({
        success: false,
        error: 'Risk level must be one of: low, medium, high, critical'
      });
    }

    const technology = await technologyRepository.create(technologyData);
    
    res.status(201).json({
      success: true,
      data: technology,
      message: 'Technology created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to create technology: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/technologies
 * @desc    Get all technologies
 * @access  Private
 */
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await technologyRepository.findAll();
    res.json({
      success: true,
      data: technologies,
      count: technologies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch technologies: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/technologies/:id
 * @desc    Get technology by ID
 * @access  Private
 */
router.get('/technologies/:id', async (req, res) => {
  try {
    const technology = await technologyRepository.findById(req.params.id);
    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }
    
    res.json({
      success: true,
      data: technology
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch technology: ${error.message}`
    });
  }
});

/**
 * @route   PUT /api/technologies/:id
 * @desc    Update a technology
 * @access  Private (Admin/Auditor)
 */
router.put('/technologies/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const technologyId = req.params.id;
    const updateData = {
      name: req.body.name,
      version: req.body.version,
      vendor: req.body.vendor,
      category: req.body.category,
      riskLevel: req.body.riskLevel,
      description: req.body.description
    };

    // Validate required fields
    if (!updateData.name || !updateData.category) {
      return res.status(400).json({
        success: false,
        error: 'Technology name and category are required'
      });
    }

    // Validate risk level if provided
    if (updateData.riskLevel) {
      const validRiskLevels = ['low', 'medium', 'high', 'critical'];
      if (!validRiskLevels.includes(updateData.riskLevel)) {
        return res.status(400).json({
          success: false,
          error: 'Risk level must be one of: low, medium, high, critical'
        });
      }
    }

    const updatedTechnology = await technologyRepository.update(technologyId, updateData);
    
    if (!updatedTechnology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }

    res.json({
      success: true,
      data: updatedTechnology,
      message: 'Technology updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to update technology: ${error.message}`
    });
  }
});

/**
 * @route   DELETE /api/technologies/:id
 * @desc    Delete a technology
 * @access  Private (Admin/Auditor)
 */
router.delete('/technologies/:id', requireAuditorOrAdmin, async (req, res) => {
  try {
    const technologyId = req.params.id;
    const deleted = await technologyRepository.delete(technologyId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }

    res.json({
      success: true,
      message: 'Technology deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to delete technology: ${error.message}`
    });
  }
});

// ===== RELATIONSHIP MANAGEMENT =====

/**
 * @route   POST /api/sections/:sectionId/questions
 * @desc    Add questions to a section
 * @access  Private (Admin/Auditor)
 */
router.post('/sections/:sectionId/questions', requireAuditorOrAdmin, async (req, res) => {
  try {
    const sectionId = req.params.sectionId;
    const questionIds = req.body.questionIds || [];

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question IDs array is required'
      });
    }

    // Verify section exists
    const section = await sectionRepository.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }

    // Add questions to section (this would need to be implemented in the repository)
    const result = await sectionRepository.addQuestions(sectionId, questionIds);
    
    res.json({
      success: true,
      data: result,
      message: 'Questions added to section successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to add questions to section: ${error.message}`
    });
  }
});

/**
 * @route   POST /api/questionnaires/:questionnaireId/sections
 * @desc    Add sections to a questionnaire
 * @access  Private (Admin/Auditor)
 */
router.post('/questionnaires/:questionnaireId/sections', requireAuditorOrAdmin, async (req, res) => {
  try {
    const questionnaireId = req.params.questionnaireId;
    const sectionIds = req.body.sectionIds || [];

    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Section IDs array is required'
      });
    }

    // Verify questionnaire exists
    const questionnaire = await questionnaireRepository.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        error: 'Questionnaire not found'
      });
    }

    // Add sections to questionnaire (this would need to be implemented in the repository)
    const result = await questionnaireRepository.addSections(questionnaireId, sectionIds);
    
    res.json({
      success: true,
      data: result,
      message: 'Sections added to questionnaire successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to add sections to questionnaire: ${error.message}`
    });
  }
});

/**
 * @route   POST /api/technologies/:technologyId/questionnaire
 * @desc    Link a questionnaire to a technology
 * @access  Private (Admin/Auditor)
 */
router.post('/technologies/:technologyId/questionnaire', requireAuditorOrAdmin, async (req, res) => {
  try {
    const technologyId = req.params.technologyId;
    const questionnaireId = req.body.questionnaireId;

    if (!questionnaireId) {
      return res.status(400).json({
        success: false,
        error: 'Questionnaire ID is required'
      });
    }

    // Verify both technology and questionnaire exist
    const technology = await technologyRepository.findById(technologyId);
    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }

    const questionnaire = await questionnaireRepository.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        error: 'Questionnaire not found'
      });
    }

    // Link questionnaire to technology (this would need to be implemented in the repository)
    const result = await technologyRepository.linkQuestionnaire(technologyId, questionnaireId);
    
    res.json({
      success: true,
      data: result,
      message: 'Questionnaire linked to technology successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to link questionnaire to technology: ${error.message}`
    });
  }
});

// ===== UTILITY ENDPOINTS =====

/**
 * @route   GET /api/structure
 * @desc    Get complete questionnaire structure for frontend
 * @access  Private
 */
router.get('/structure', async (req, res) => {
  try {
    const [questions, sections, questionnaires, technologies] = await Promise.all([
      questionRepository.findAll(),
      sectionRepository.findAll(),
      questionnaireRepository.findAll(),
      technologyRepository.findAll()
    ]);

    res.json({
      success: true,
      data: {
        questions,
        sections,
        questionnaires,
        technologies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch structure: ${error.message}`
    });
  }
});

module.exports = router;

