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
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     description: Create a new audit question with text, guidance, and evidence requirements
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionRequest'
 *           example:
 *             text: "Does the organization have a documented information security policy?"
 *             guidance: "Look for a formal policy document that outlines security objectives and procedures"
 *             evidenceRequired: "Yes"
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Question'
 *             example:
 *               success: true
 *               data:
 *                 id: "507f1f77bcf86cd799439011"
 *                 text: "Does the organization have a documented information security policy?"
 *                 guidance: "Look for a formal policy document that outlines security objectives and procedures"
 *                 evidenceRequired: "Yes"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               message: "Question created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Question text and evidence requirement are required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     description: Retrieve a list of all audit questions in the system
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *             example:
 *               success: true
 *               data:
 *                 - id: "507f1f77bcf86cd799439011"
 *                   text: "Does the organization have a documented information security policy?"
 *                   guidance: "Look for a formal policy document"
 *                   evidenceRequired: "Yes"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *               count: 1
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     description: Retrieve a specific audit question by its unique identifier
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Question'
 *             example:
 *               success: true
 *               data:
 *                 id: "507f1f77bcf86cd799439011"
 *                 text: "Does the organization have a documented information security policy?"
 *                 guidance: "Look for a formal policy document"
 *                 evidenceRequired: "Yes"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Question not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question
 *     description: Update an existing audit question's text, guidance, or evidence requirements
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionRequest'
 *           example:
 *             text: "Does the organization have an updated information security policy?"
 *             guidance: "Look for a recently reviewed formal policy document"
 *             evidenceRequired: "Yes"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     description: Permanently delete an audit question from the system
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Question deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions/standalone:
 *   get:
 *     summary: Get standalone questions
 *     description: Retrieve all questions that are not linked to any section
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Standalone questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions/unlink:
 *   post:
 *     summary: Unlink questions from sections
 *     description: Remove the association between questions and their sections, making them standalone
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdArrayRequest'
 *           example:
 *             questionIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       200:
 *         description: Questions unlinked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Questions unlinked from sections successfully"
 *       400:
 *         description: Validation error - Question IDs array is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questions/section/{sectionId}:
 *   get:
 *     summary: Get questions by section
 *     description: Retrieve all questions that belong to a specific section
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Section questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections:
 *   post:
 *     summary: Create a new section
 *     description: Create a new section for organizing audit questions
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SectionRequest'
 *           example:
 *             title: "Security Policies"
 *             description: "Questions related to organizational security policies"
 *             weight: 5
 *     responses:
 *       201:
 *         description: Section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Section'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections:
 *   get:
 *     summary: Get all sections
 *     description: Retrieve a list of all sections in the system
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Section'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections/{id}:
 *   get:
 *     summary: Get section by ID
 *     description: Retrieve a specific section by its unique identifier
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Section retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Section'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections/{id}:
 *   put:
 *     summary: Update a section
 *     description: Update an existing section's title, description, or weight
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SectionRequest'
 *           example:
 *             title: "Updated Security Policies"
 *             description: "Updated questions related to organizational security policies"
 *             weight: 7
 *     responses:
 *       200:
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Section'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections/{id}:
 *   delete:
 *     summary: Delete a section
 *     description: Permanently delete a section from the system
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Section deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections/questionnaire/{questionnaireId}:
 *   get:
 *     summary: Get sections by questionnaire
 *     description: Retrieve all sections that belong to a specific questionnaire
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionnaireId
 *         required: true
 *         schema:
 *           type: string
 *         description: Questionnaire ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Questionnaire sections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Section'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires:
 *   post:
 *     summary: Create a new questionnaire
 *     description: Create a new questionnaire for organizing sections and questions
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionnaireRequest'
 *           example:
 *             title: "Cloud Security Assessment"
 *             version: "2.0"
 *             description: "Comprehensive assessment for cloud infrastructure security"
 *     responses:
 *       201:
 *         description: Questionnaire created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Questionnaire'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires:
 *   get:
 *     summary: Get all questionnaires
 *     description: Retrieve a list of all questionnaires in the system
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questionnaires retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Questionnaire'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires/{id}:
 *   get:
 *     summary: Get questionnaire by ID
 *     description: Retrieve a specific questionnaire by its unique identifier
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Questionnaire ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Questionnaire retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Questionnaire'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires/{id}:
 *   put:
 *     summary: Update a questionnaire
 *     description: Update an existing questionnaire's title, version, or description
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Questionnaire ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionnaireRequest'
 *           example:
 *             title: "Updated Cloud Security Assessment"
 *             version: "2.1"
 *             description: "Updated comprehensive assessment for cloud infrastructure security"
 *     responses:
 *       200:
 *         description: Questionnaire updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Questionnaire'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires/{id}:
 *   delete:
 *     summary: Delete a questionnaire
 *     description: Permanently delete a questionnaire from the system
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Questionnaire ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Questionnaire deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Questionnaire deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires/technology/{technologyId}:
 *   get:
 *     summary: Get questionnaires by technology
 *     description: Retrieve all questionnaires linked to a specific technology
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: technologyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Technology questionnaires retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Questionnaire'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/technologies:
 *   post:
 *     summary: Create a new technology
 *     description: Create a new technology entry for audit tracking
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechnologyRequest'
 *           example:
 *             name: "Microsoft Azure"
 *             version: "2023"
 *             vendor: "Microsoft"
 *             category: "Cloud Platform"
 *             riskLevel: "medium"
 *             description: "Microsoft's cloud computing platform"
 *     responses:
 *       201:
 *         description: Technology created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/technologies:
 *   get:
 *     summary: Get all technologies
 *     description: Retrieve a list of all technologies in the system
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technologies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Technology'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/technologies/{id}:
 *   get:
 *     summary: Get technology by ID
 *     description: Retrieve a specific technology by its unique identifier
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Technology retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Technology'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Technology not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/technologies/{id}:
 *   put:
 *     summary: Update a technology
 *     description: Update an existing technology's information
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechnologyRequest'
 *           example:
 *             name: "Microsoft Azure"
 *             version: "2024"
 *             vendor: "Microsoft"
 *             category: "Cloud Platform"
 *             riskLevel: "high"
 *             description: "Updated Microsoft's cloud computing platform"
 *     responses:
 *       200:
 *         description: Technology updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Technology not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/technologies/{id}:
 *   delete:
 *     summary: Delete a technology
 *     description: Permanently delete a technology from the system
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Technology deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Technology deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Technology not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/sections/{sectionId}/questions:
 *   post:
 *     summary: Add questions to a section
 *     description: Link multiple questions to a specific section
 *     tags: [Relationships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdArrayRequest'
 *           example:
 *             questionIds: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *     responses:
 *       200:
 *         description: Questions added to section successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Questions added to section successfully"
 *       400:
 *         description: Validation error - Question IDs array is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/questionnaires/{questionnaireId}/sections:
 *   post:
 *     summary: Add sections to a questionnaire
 *     description: Link multiple sections to a specific questionnaire
 *     tags: [Relationships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionnaireId
 *         required: true
 *         schema:
 *           type: string
 *         description: Questionnaire ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SectionIdArrayRequest'
 *           example:
 *             sectionIds: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *     responses:
 *       200:
 *         description: Sections added to questionnaire successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Sections added to questionnaire successfully"
 *       400:
 *         description: Validation error - Section IDs array is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/technologies/{technologyId}/questionnaire:
 *   post:
 *     summary: Link a questionnaire to a technology
 *     description: Associate a questionnaire with a specific technology
 *     tags: [Relationships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: technologyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionnaireIdRequest'
 *           example:
 *             questionnaireId: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Questionnaire linked to technology successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Questionnaire linked to technology successfully"
 *       400:
 *         description: Validation error - Questionnaire ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Technology or questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/structure:
 *   get:
 *     summary: Get complete questionnaire structure
 *     description: Retrieve the complete data structure including all questions, sections, questionnaires, and technologies for frontend consumption
 *     tags: [Utilities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete structure retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *                     sections:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Section'
 *                     questionnaires:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Questionnaire'
 *                     technologies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Technology'
 *             example:
 *               success: true
 *               data:
 *                 questions: []
 *                 sections: []
 *                 questionnaires: []
 *                 technologies: []
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

