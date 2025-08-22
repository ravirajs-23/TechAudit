# Tech Audit Questionnaire Builder API Documentation

## Overview

The Tech Audit Questionnaire Builder API provides a complete set of endpoints for managing questions, sections, questionnaires, and technologies. The API follows RESTful principles and provides full CRUD operations for all entities.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints require authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Questions Management

#### Create Question
```http
POST /questions
```

**Request Body:**
```json
{
  "text": "Is database encryption enabled?",
  "guidance": "Check database configuration for encryption settings",
  "evidenceRequired": "Yes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "text": "Is database encryption enabled?",
    "guidance": "Check database configuration for encryption settings",
    "evidenceRequired": "Yes",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Question created successfully"
}
```

#### Get All Questions
```http
GET /questions
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

#### Get Question by ID
```http
GET /questions/:id
```

#### Update Question
```http
PUT /questions/:id
```

**Request Body:**
```json
{
  "text": "Updated question text",
  "guidance": "Updated guidance",
  "evidenceRequired": "No"
}
```

#### Delete Question
```http
DELETE /questions/:id
```

### 2. Sections Management

#### Create Section
```http
POST /sections
```

**Request Body:**
```json
{
  "title": "Database Security",
  "description": "Core security controls for database access",
  "weight": 8
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Database Security",
    "description": "Core security controls for database access",
    "weight": 8,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Section created successfully"
}
```

#### Get All Sections
```http
GET /sections
```

#### Get Section by ID
```http
GET /sections/:id
```

#### Update Section
```http
PUT /sections/:id
```

#### Delete Section
```http
DELETE /sections/:id
```

### 3. Questionnaires Management

#### Create Questionnaire
```http
POST /questionnaires
```

**Request Body:**
```json
{
  "title": "Database Security Audit",
  "version": "1.0",
  "description": "Comprehensive security audit for databases"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Database Security Audit",
    "version": "1.0",
    "description": "Comprehensive security audit for databases",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Questionnaire created successfully"
}
```

#### Get All Questionnaires
```http
GET /questionnaires
```

#### Get Questionnaire by ID
```http
GET /questionnaires/:id
```

#### Update Questionnaire
```http
PUT /questionnaires/:id
```

#### Delete Questionnaire
```http
DELETE /questionnaires/:id
```

### 4. Technologies Management

#### Create Technology
```http
POST /technologies
```

**Request Body:**
```json
{
  "name": "Oracle Database",
  "version": "19c",
  "vendor": "Oracle Corporation",
  "category": "database",
  "riskLevel": "high",
  "description": "Enterprise database management system"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "name": "Oracle Database",
    "version": "19c",
    "vendor": "Oracle Corporation",
    "category": "database",
    "riskLevel": "high",
    "description": "Enterprise database management system",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Technology created successfully"
}
```

#### Get All Technologies
```http
GET /technologies
```

#### Get Technology by ID
```http
GET /technologies/:id
```

#### Update Technology
```http
PUT /technologies/:id
```

#### Delete Technology
```http
DELETE /technologies/:id
```

### 5. Relationship Management

#### Add Questions to Section
```http
POST /sections/:sectionId/questions
```

**Request Body:**
```json
{
  "questionIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439015"]
}
```

#### Add Sections to Questionnaire
```http
POST /questionnaires/:questionnaireId/sections
```

**Request Body:**
```json
{
  "sectionIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439016"]
}
```

#### Link Questionnaire to Technology
```http
POST /technologies/:technologyId/questionnaire
```

**Request Body:**
```json
{
  "questionnaireId": "507f1f77bcf86cd799439013"
}
```

### 6. Utility Endpoints

#### Get Complete Structure
```http
GET /structure
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [...],
    "sections": [...],
    "questionnaires": [...],
    "technologies": [...]
  }
}
```

## Data Models

### Question
```json
{
  "id": "string",
  "text": "string (required, max 1000 chars)",
  "guidance": "string (optional, max 2000 chars)",
  "evidenceRequired": "enum (required: 'Yes', 'No', 'Optional')",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Section
```json
{
  "id": "string",
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "weight": "number (1-10, default 1)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Questionnaire
```json
{
  "id": "string",
  "title": "string (required, max 200 chars)",
  "version": "string (required, max 50 chars)",
  "description": "string (optional, max 1000 chars)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Technology
```json
{
  "id": "string",
  "name": "string (required, max 100 chars)",
  "version": "string (required, max 50 chars)",
  "vendor": "string (optional, max 100 chars)",
  "category": "string (required, max 50 chars)",
  "riskLevel": "enum (default 'medium': 'low', 'medium', 'high', 'critical')",
  "description": "string (optional, max 1000 chars)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Validation Rules

### Questions
- `text`: Required, 1-1000 characters
- `guidance`: Optional, 0-2000 characters
- `evidenceRequired`: Required, must be 'Yes', 'No', or 'Optional'

### Sections
- `title`: Required, 1-200 characters
- `description`: Optional, 0-1000 characters
- `weight`: Required, 1-10 (integer)

### Questionnaires
- `title`: Required, 1-200 characters
- `version`: Required, 1-50 characters
- `description`: Optional, 0-1000 characters

### Technologies
- `name`: Required, 1-100 characters
- `version`: Required, 1-50 characters
- `vendor`: Optional, 0-100 characters
- `category`: Required, 1-50 characters
- `riskLevel`: Required, must be 'low', 'medium', 'high', or 'critical'
- `description`: Optional, 0-1000 characters

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or invalid data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

CORS is enabled for development. Configure appropriate CORS settings for production.

## Testing

Use the provided `test-api.js` script to test all endpoints:

```bash
node test-api.js
```

## Example Usage

### Frontend Integration

```javascript
// Create a question
const createQuestion = async (questionData) => {
  try {
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    });
    
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to create question:', error);
    throw error;
  }
};

// Get all questions
const getQuestions = async () => {
  try {
    const response = await fetch('/api/questions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to get questions:', error);
    throw error;
  }
};
```

## Future Enhancements

- **Bulk Operations**: Create/update multiple entities at once
- **Search & Filtering**: Advanced search with filters
- **Pagination**: Handle large datasets
- **Audit Logging**: Track all changes
- **Export/Import**: JSON/CSV export and import
- **Versioning**: Track entity versions over time
- **Templates**: Pre-built questionnaire templates
- **Collaboration**: Multi-user editing with conflict resolution

## Support

For API support or questions, please refer to the project documentation or create an issue in the repository.
