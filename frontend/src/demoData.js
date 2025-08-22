// Demo data for the Questionnaire Builder
// This shows how the system works with pre-built examples

export const demoQuestions = [
  {
    id: 'q1',
    text: 'Are database connections encrypted using TLS 1.2 or higher?',
    guidance: 'Check database configuration files and connection strings for encryption settings.',
    evidenceRequired: 'Yes',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'q2',
    text: 'Is multi-factor authentication enabled for database access?',
    guidance: 'Verify that MFA is required for all database user accounts.',
    evidenceRequired: 'Yes',
    createdAt: '2024-01-15T10:01:00Z'
  },
  {
    id: 'q3',
    text: 'Are database backups encrypted and stored securely?',
    guidance: 'Check backup encryption settings and storage location security.',
    evidenceRequired: 'Yes',
    createdAt: '2024-01-15T10:02:00Z'
  },
  {
    id: 'q4',
    text: 'Is database performance monitoring enabled and configured?',
    guidance: 'Verify that performance metrics are being collected and analyzed.',
    evidenceRequired: 'Optional',
    createdAt: '2024-01-15T10:03:00Z'
  },
  {
    id: 'q5',
    text: 'Are database indexes optimized for query performance?',
    guidance: 'Review index usage statistics and query execution plans.',
    evidenceRequired: 'Optional',
    createdAt: '2024-01-15T10:04:00Z'
  },
  {
    id: 'q6',
    text: 'Is database compliance with industry standards documented?',
    guidance: 'Check for compliance documentation and audit reports.',
    evidenceRequired: 'Yes',
    createdAt: '2024-01-15T10:05:00Z'
  },
  {
    id: 'q7',
    text: 'Are database availability and disaster recovery procedures tested?',
    guidance: 'Verify that DR procedures are documented and regularly tested.',
    evidenceRequired: 'Yes',
    createdAt: '2024-01-15T10:06:00Z'
  },
  {
    id: 'q8',
    text: 'Is database maintenance and patching schedule documented?',
    guidance: 'Check for maintenance procedures and patch management processes.',
    evidenceRequired: 'No',
    createdAt: '2024-01-01T10:07:00Z'
  }
];

export const demoSections = [
  {
    id: 's1',
    title: 'Database Security',
    description: 'Core security controls for database access and data protection',
    weight: 8,
    questions: demoQuestions.slice(0, 3), // First 3 questions
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 's2',
    title: 'Performance Optimization',
    description: 'Database performance monitoring and optimization practices',
    weight: 6,
    questions: demoQuestions.slice(3, 5), // Questions 4-5
    createdAt: '2024-01-15T11:01:00Z'
  },
  {
    id: 's3',
    title: 'Compliance & Governance',
    description: 'Regulatory compliance and governance requirements',
    weight: 7,
    questions: [demoQuestions[5]], // Question 6
    createdAt: '2024-01-15T11:02:00Z'
  },
  {
    id: 's4',
    title: 'High Availability',
    description: 'Database availability and disaster recovery procedures',
    weight: 8,
    questions: [demoQuestions[6]], // Question 7
    createdAt: '2024-01-15T11:03:00Z'
  },
  {
    id: 's5',
    title: 'Maintenance & Operations',
    description: 'Database maintenance, patching, and operational procedures',
    weight: 5,
    questions: [demoQuestions[7]], // Question 8
    createdAt: '2024-01-15T11:04:00Z'
  }
];

export const demoQuestionnaires = [
  {
    id: 'qn1',
    title: 'Oracle Database Security Audit',
    version: '2.1',
    description: 'Comprehensive security audit questionnaire for Oracle databases covering all major security controls and compliance requirements.',
    sections: demoSections,
    createdAt: '2024-01-15T12:00:00Z'
  },
  {
    id: 'qn2',
    title: 'Database Performance Assessment',
    version: '1.0',
    description: 'Focused questionnaire for evaluating database performance and optimization practices.',
    sections: demoSections.filter(s => s.title === 'Performance Optimization'),
    createdAt: '2024-01-15T12:01:00Z'
  }
];

export const demoTechnologies = [
  {
    id: 't1',
    name: 'Oracle Database',
    version: '19c',
    vendor: 'Oracle Corporation',
    category: 'database',
    riskLevel: 'high',
    description: 'Enterprise-grade relational database management system used for critical business applications.',
    questionnaire: demoQuestionnaires[0],
    createdAt: '2024-01-15T13:00:00Z'
  },
  {
    id: 't2',
    name: 'SQL Server',
    version: '2019',
    vendor: 'Microsoft',
    category: 'database',
    riskLevel: 'medium',
    description: 'Microsoft SQL Server database platform for business intelligence and data analytics.',
    questionnaire: demoQuestionnaires[0],
    createdAt: '2024-01-15T13:01:00Z'
  }
];

// Helper function to load demo data
export const loadDemoData = () => {
  return {
    questions: demoQuestions,
    sections: demoSections,
    questionnaires: demoQuestionnaires,
    technologies: demoTechnologies
  };
};

// Helper function to get category info
export const getCategoryInfo = (category) => {
  const categories = {
    security: { label: '🔒 Security', color: '#ef4444' },
    performance: { label: '⚡ Performance', color: '#3b82f6' },
    compliance: { label: '📋 Compliance', color: '#10b981' },
    availability: { label: '🔄 Availability', color: '#f59e0b' },
    maintainability: { label: '🔧 Maintainability', color: '#8b5cf6' }
  };
  return categories[category] || categories.security;
};

// Helper function to get risk level info
export const getRiskLevelInfo = (riskLevel) => {
  const riskLevels = {
    low: { label: '🟢 Low', color: '#10b981' },
    medium: { label: '🟡 Medium', color: '#f59e0b' },
    high: { label: '🟠 High', color: '#f97316' },
    critical: { label: '🔴 Critical', color: '#ef4444' }
  };
  return riskLevels[riskLevel] || riskLevels.medium;
};

