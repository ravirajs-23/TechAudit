const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech Audit Management System API',
      version: '1.0.0',
      description: 'A comprehensive API for managing technology audits with role-based access control',
      contact: {
        name: 'TechAudit Team',
        email: 'support@tecaudit.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.tecaudit.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            role: {
              type: 'string',
              enum: ['admin', 'auditor'],
              description: 'User role in the system'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)'
            },
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User last name'
            },
            role: {
              type: 'string',
              enum: ['admin', 'auditor'],
              default: 'auditor',
              description: 'User role (optional, defaults to auditor)'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT access token'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name that caused the error'
                  },
                  message: {
                    type: 'string',
                    description: 'Error message for the field'
                  }
                }
              }
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique question identifier'
            },
            text: {
              type: 'string',
              description: 'Question text'
            },
            guidance: {
              type: 'string',
              description: 'Additional guidance for answering the question'
            },
            evidenceRequired: {
              type: 'string',
              enum: ['Yes', 'No', 'Optional'],
              description: 'Whether evidence is required for this question'
            },
            sectionId: {
              type: 'string',
              description: 'ID of the section this question belongs to (if any)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Question creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        QuestionRequest: {
          type: 'object',
          required: ['text', 'evidenceRequired'],
          properties: {
            text: {
              type: 'string',
              description: 'Question text'
            },
            guidance: {
              type: 'string',
              description: 'Additional guidance for answering the question'
            },
            evidenceRequired: {
              type: 'string',
              enum: ['Yes', 'No', 'Optional'],
              description: 'Whether evidence is required for this question'
            }
          }
        },
        Section: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique section identifier'
            },
            title: {
              type: 'string',
              description: 'Section title'
            },
            description: {
              type: 'string',
              description: 'Section description'
            },
            weight: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              description: 'Section weight (1-10)'
            },
            questionnaireId: {
              type: 'string',
              description: 'ID of the questionnaire this section belongs to (if any)'
            },
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question'
              },
              description: 'Questions in this section'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Section creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        SectionRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Section title'
            },
            description: {
              type: 'string',
              description: 'Section description'
            },
            weight: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              default: 1,
              description: 'Section weight (1-10, defaults to 1)'
            }
          }
        },
        Questionnaire: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique questionnaire identifier'
            },
            title: {
              type: 'string',
              description: 'Questionnaire title'
            },
            version: {
              type: 'string',
              description: 'Questionnaire version'
            },
            description: {
              type: 'string',
              description: 'Questionnaire description'
            },
            technologyId: {
              type: 'string',
              description: 'ID of the technology this questionnaire is linked to (if any)'
            },
            sections: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Section'
              },
              description: 'Sections in this questionnaire'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Questionnaire creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        QuestionnaireRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Questionnaire title'
            },
            version: {
              type: 'string',
              default: '1.0',
              description: 'Questionnaire version (defaults to 1.0)'
            },
            description: {
              type: 'string',
              description: 'Questionnaire description'
            }
          }
        },
        Technology: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique technology identifier'
            },
            name: {
              type: 'string',
              description: 'Technology name'
            },
            version: {
              type: 'string',
              description: 'Technology version'
            },
            vendor: {
              type: 'string',
              description: 'Technology vendor'
            },
            category: {
              type: 'string',
              description: 'Technology category'
            },
            riskLevel: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Risk level associated with this technology'
            },
            description: {
              type: 'string',
              description: 'Technology description'
            },
            questionnaire: {
              $ref: '#/components/schemas/Questionnaire',
              description: 'Linked questionnaire (if any)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Technology creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        TechnologyRequest: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            name: {
              type: 'string',
              description: 'Technology name'
            },
            version: {
              type: 'string',
              description: 'Technology version'
            },
            vendor: {
              type: 'string',
              description: 'Technology vendor'
            },
            category: {
              type: 'string',
              description: 'Technology category'
            },
            riskLevel: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              default: 'medium',
              description: 'Risk level (defaults to medium)'
            },
            description: {
              type: 'string',
              description: 'Technology description'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            count: {
              type: 'integer',
              description: 'Number of items (for list responses)'
            }
          }
        },
        IdArrayRequest: {
          type: 'object',
          required: ['questionIds'],
          properties: {
            questionIds: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of question IDs'
            }
          }
        },
        SectionIdArrayRequest: {
          type: 'object',
          required: ['sectionIds'],
          properties: {
            sectionIds: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of section IDs'
            }
          }
        },
        QuestionnaireIdRequest: {
          type: 'object',
          required: ['questionnaireId'],
          properties: {
            questionnaireId: {
              type: 'string',
              description: 'Questionnaire ID'
            }
          }
        },
        Audit: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique audit identifier'
            },
            projectId: {
              type: 'string',
              description: 'ID of the project being audited'
            },
            leadAuditorId: {
              type: 'string',
              description: 'ID of the lead auditor'
            },
            teamMembers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of team member user IDs'
            },
            status: {
              type: 'string',
              enum: ['planning', 'in-progress', 'review', 'completed', 'cancelled'],
              description: 'Current status of the audit'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Audit start date'
            },
            completionDate: {
              type: 'string',
              format: 'date-time',
              description: 'Audit completion date'
            },
            overallScore: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Overall audit score (0-100)'
            },
            durationInDays: {
              type: 'number',
              description: 'Calculated duration of the audit in days'
            },
            isOverdue: {
              type: 'boolean',
              description: 'Whether the audit is overdue'
            },
            progressPercentage: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Progress percentage based on status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Audit creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Health',
        description: 'System health and status endpoints'
      },
      {
        name: 'Questions',
        description: 'Question management endpoints for creating and managing audit questions'
      },
      {
        name: 'Sections',
        description: 'Section management endpoints for organizing questions into logical groups'
      },
      {
        name: 'Questionnaires',
        description: 'Questionnaire management endpoints for creating complete audit forms'
      },
      {
        name: 'Technologies',
        description: 'Technology management endpoints for tracking audited technologies'
      },
      {
        name: 'Relationships',
        description: 'Endpoints for managing relationships between questions, sections, questionnaires, and technologies'
      },
      {
        name: 'Utilities',
        description: 'Utility endpoints for retrieving complete data structures'
      },
      {
        name: 'Audits',
        description: 'Audit management endpoints for creating, managing, and tracking technology audits'
      }
    ]
  },
  apis: [
    './src/presentation/routes/*.js',
    './src/presentation/middleware/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
