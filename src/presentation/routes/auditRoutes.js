const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Import dependencies
const {
    CreateAuditUseCase,
    GetAuditUseCase,
    GetAllAuditsUseCase,
    UpdateAuditUseCase,
    DeleteAuditUseCase,
    StartAuditUseCase,
    CompleteAuditUseCase,
    CancelAuditUseCase,
    UpdateAuditScoreUseCase,
    GetAuditsByStatusUseCase,
    GetOverdueAuditsUseCase
} = require('../../application/useCases/audit');
const AuditRepository = require('../../infrastructure/repositories/AuditRepository');
const authMiddleware = require('../middleware/authMiddleware');

// Initialize dependencies
const auditRepository = new AuditRepository();
const createAuditUseCase = new CreateAuditUseCase(auditRepository);
const getAuditUseCase = new GetAuditUseCase(auditRepository);
const getAllAuditsUseCase = new GetAllAuditsUseCase(auditRepository);
const updateAuditUseCase = new UpdateAuditUseCase(auditRepository);
const deleteAuditUseCase = new DeleteAuditUseCase(auditRepository);
const startAuditUseCase = new StartAuditUseCase(auditRepository);
const completeAuditUseCase = new CompleteAuditUseCase(auditRepository);
const cancelAuditUseCase = new CancelAuditUseCase(auditRepository);
const updateAuditScoreUseCase = new UpdateAuditScoreUseCase(auditRepository);
const getAuditsByStatusUseCase = new GetAuditsByStatusUseCase(auditRepository);
const getOverdueAuditsUseCase = new GetOverdueAuditsUseCase(auditRepository);

// Validation middleware
const validateCreateAudit = [
    body('projectId')
        .notEmpty()
        .withMessage('Project ID is required'),
    body('leadAuditorId')
        .notEmpty()
        .withMessage('Lead auditor ID is required'),
    body('status')
        .optional()
        .isIn(['planning', 'in-progress', 'review', 'completed', 'cancelled'])
        .withMessage('Status must be one of: planning, in-progress, review, completed, cancelled'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    body('completionDate')
        .optional()
        .isISO8601()
        .withMessage('Completion date must be a valid ISO 8601 date'),
    body('overallScore')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Overall score must be between 0 and 100')
];

const validateUpdateAudit = [
    body('projectId')
        .optional()
        .notEmpty()
        .withMessage('Project ID cannot be empty'),
    body('leadAuditorId')
        .optional()
        .notEmpty()
        .withMessage('Lead auditor ID cannot be empty'),
    body('status')
        .optional()
        .isIn(['planning', 'in-progress', 'review', 'completed', 'cancelled'])
        .withMessage('Status must be one of: planning, in-progress, review, completed, cancelled'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    body('completionDate')
        .optional()
        .isISO8601()
        .withMessage('Completion date must be a valid ISO 8601 date'),
    body('overallScore')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Overall score must be between 0 and 100')
];

const validateAuditId = [
    param('id')
        .notEmpty()
        .withMessage('Audit ID is required')
];

const validateScore = [
    body('score')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Score must be between 0 and 100')
];

const validateStatus = [
    param('status')
        .isIn(['planning', 'in-progress', 'review', 'completed', 'cancelled'])
        .withMessage('Status must be one of: planning, in-progress, review, completed, cancelled')
];

// Check validation results
const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Routes

/**
 * @swagger
 * /api/audits:
 *   post:
 *     summary: Create a new audit
 *     description: Create a new audit with project and lead auditor information
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - leadAuditorId
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID of the project to audit
 *               leadAuditorId:
 *                 type: string
 *                 description: ID of the lead auditor
 *               status:
 *                 type: string
 *                 enum: [planning, in-progress, review, completed, cancelled]
 *                 default: planning
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *               overallScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       201:
 *         description: Audit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/',
    authMiddleware,
    validateCreateAudit,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await createAuditUseCase.execute(req.body);

            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits:
 *   get:
 *     summary: Get all audits
 *     description: Retrieve all audits with optional filtering
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planning, in-progress, review, completed, cancelled]
 *         description: Filter audits by status
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter audits by project ID
 *       - in: query
 *         name: leadAuditorId
 *         schema:
 *           type: string
 *         description: Filter audits by lead auditor ID
 *     responses:
 *       200:
 *         description: List of audits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/',
    authMiddleware,
    async (req, res) => {
        try {
            const { status, projectId, leadAuditorId } = req.query;

            let result;
            if (status) {
                result = await getAuditsByStatusUseCase.execute(status);
            } else {
                result = await getAllAuditsUseCase.execute();
            }

            if (result.success) {
                // Apply additional filters if provided
                let audits = result.audits;
                if (projectId) {
                    audits = audits.filter(audit => audit.projectId === projectId);
                }
                if (leadAuditorId) {
                    audits = audits.filter(audit => audit.leadAuditorId === leadAuditorId);
                }

                res.json({
                    success: true,
                    audits: audits
                });
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/overdue:
 *   get:
 *     summary: Get overdue audits
 *     description: Retrieve all audits that are overdue (started more than 14 days ago and not completed)
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of overdue audits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/overdue',
    authMiddleware,
    async (req, res) => {
        try {
            const result = await getOverdueAuditsUseCase.execute();

            if (result.success) {
                res.json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}:
 *   get:
 *     summary: Get audit by ID
 *     description: Retrieve a specific audit by its ID
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     responses:
 *       200:
 *         description: Audit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.get('/:id',
    authMiddleware,
    validateAuditId,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await getAuditUseCase.execute(req.params.id);

            if (result.success) {
                res.json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}:
 *   put:
 *     summary: Update audit
 *     description: Update an existing audit's information
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *               leadAuditorId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [planning, in-progress, review, completed, cancelled]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *               overallScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Audit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.put('/:id',
    authMiddleware,
    validateAuditId,
    validateUpdateAudit,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await updateAuditUseCase.execute(req.params.id, req.body);

            if (result.success) {
                res.json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}:
 *   delete:
 *     summary: Delete audit
 *     description: Delete an audit by its ID
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     responses:
 *       200:
 *         description: Audit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',
    authMiddleware,
    validateAuditId,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await deleteAuditUseCase.execute(req.params.id);

            if (result.success) {
                res.json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}/start:
 *   post:
 *     summary: Start audit
 *     description: Start an audit (change status from planning to in-progress)
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     responses:
 *       200:
 *         description: Audit started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error or business rule violation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.post('/:id/start',
    authMiddleware,
    validateAuditId,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await startAuditUseCase.execute(req.params.id);

            if (result.success) {
                res.json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}/complete:
 *   post:
 *     summary: Complete audit
 *     description: Complete an audit (change status from review to completed)
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     responses:
 *       200:
 *         description: Audit completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error or business rule violation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.post('/:id/complete',
    authMiddleware,
    validateAuditId,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await completeAuditUseCase.execute(req.params.id);

            if (result.success) {
                res.json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}/cancel:
 *   post:
 *     summary: Cancel audit
 *     description: Cancel an audit (change status to cancelled)
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     responses:
 *       200:
 *         description: Audit cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.post('/:id/cancel',
    authMiddleware,
    validateAuditId,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await cancelAuditUseCase.execute(req.params.id);

            if (result.success) {
                res.json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

/**
 * @swagger
 * /api/audits/{id}/score:
 *   put:
 *     summary: Update audit score
 *     description: Update the overall score of an audit
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Overall audit score (0-100)
 *     responses:
 *       200:
 *         description: Audit score updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 audit:
 *                   $ref: '#/components/schemas/Audit'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Server error
 */
router.put('/:id/score',
    authMiddleware,
    validateAuditId,
    validateScore,
    checkValidationResult,
    async (req, res) => {
        try {
            const result = await updateAuditScoreUseCase.execute(req.params.id, req.body.score);

            if (result.success) {
                res.json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
);

module.exports = router;
