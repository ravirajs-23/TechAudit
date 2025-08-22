import React, { useState } from 'react';

const QuestionnaireViewer = ({ questionnaires, technologies }) => {
  const [viewMode, setViewMode] = useState('hierarchy'); // 'hierarchy' or 'summary'
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleAllSections = () => {
    if (expandedSections.size === 0) {
      // Expand all
      const allSectionIds = new Set();
      questionnaires.forEach(q => {
        q.sections.forEach(s => allSectionIds.add(s.id));
      });
      setExpandedSections(allSectionIds);
    } else {
      // Collapse all
      setExpandedSections(new Set());
    }
  };

  const getTotalQuestions = () => {
    return questionnaires.reduce((total, q) => {
      return total + q.sections.reduce((sectionTotal, s) => {
        return sectionTotal + s.questions.length;
      }, 0);
    }, 0);
  };

  const getTotalWeight = () => {
    return questionnaires.reduce((total, q) => {
      return total + q.sections.reduce((sectionTotal, s) => {
        return sectionTotal + s.weight;
      }, 0);
    }, 0);
  };

  const getMaxPossibleScore = () => {
    return getTotalQuestions() * 2; // 2 points per question for compliant
  };

  const renderHierarchyView = () => (
    <div className="hierarchy-view">
      <div className="view-controls">
        <button 
          onClick={toggleAllSections}
          className="toggle-all-btn"
        >
          {expandedSections.size === 0 ? '🔽 Expand All' : '🔼 Collapse All'}
        </button>
      </div>

      {technologies.map(tech => (
        <div key={tech.id} className="technology-container">
          <div className="technology-header">
            <h3>🔧 {tech.name}</h3>
            <div className="tech-meta">
              <span className="tech-category">{tech.category}</span>
              <span className={`tech-risk risk-${tech.riskLevel}`}>
                {tech.riskLevel} Risk
              </span>
            </div>
          </div>

          {tech.questionnaire && (
            <div className="questionnaire-container">
              <div className="questionnaire-header">
                <h4>📊 {tech.questionnaire.title}</h4>
                <span className="version-badge">v{tech.questionnaire.version}</span>
              </div>
              
              {tech.questionnaire.description && (
                <p className="questionnaire-description">{tech.questionnaire.description}</p>
              )}

              <div className="sections-container">
                {tech.questionnaire.sections.map(section => (
                  <div key={section.id} className="section-container">
                    <div 
                      className="section-header"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="section-title">
                        <span className="expand-icon">
                          {expandedSections.has(section.id) ? '🔽' : '▶️'}
                        </span>
                        <h5>📋 {section.title}</h5>
                      </div>
                      <div className="section-meta">
                        <span className="question-count">{section.questions.length} questions</span>
                        <span className="weight-badge">Weight: {section.weight}</span>
                      </div>
                    </div>

                    {expandedSections.has(section.id) && (
                      <div className="questions-container">
                        {section.questions.map((question, index) => (
                          <div key={question.id} className="question-item">
                            <div className="question-header">
                              <span className="question-number">Q{index + 1}</span>
                            </div>
                            <div className="question-text">{question.text}</div>
                            {question.guidance && (
                              <div className="question-guidance">
                                <strong>Guidance:</strong> {question.guidance}
                              </div>
                            )}
                            {question.evidenceRequired && (
                              <div className="question-evidence">
                                <strong>Evidence:</strong> 
                                <span className={`evidence-badge evidence-${question.evidenceRequired.toLowerCase()}`}>
                                  {question.evidenceRequired}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSummaryView = () => (
    <div className="summary-view">
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-number">{technologies.length}</div>
          <div className="stat-label">Technologies</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{questionnaires.length}</div>
          <div className="stat-label">Questionnaires</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getTotalQuestions()}</div>
          <div className="stat-label">Total Questions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getTotalWeight()}</div>
          <div className="stat-label">Total Weight</div>
        </div>
      </div>

      <div className="summary-details">
        <h3>📊 Audit Structure Summary</h3>
        
        <div className="summary-section">
          <h4>Technologies & Questionnaires</h4>
          {technologies.map(tech => (
            <div key={tech.id} className="summary-item">
              <strong>{tech.name}</strong> → {tech.questionnaire?.title || 'No questionnaire'}
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h4>Question Distribution by Section</h4>
          {questionnaires.map(q => (
            <div key={q.id} className="summary-item">
              <span className="questionnaire-title">{q.title}</span>
              <div className="section-breakdown">
                {q.sections.map(s => (
                  <div key={s.id} className="section-summary">
                    <span className="section-name">{s.title}</span>
                    <span className="count-badge">{s.questions.length} questions</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h4>Scoring Information</h4>
          <div className="scoring-info">
            <p><strong>Maximum Possible Score:</strong> {getMaxPossibleScore()} points</p>
            <p><strong>Scoring System:</strong></p>
            <ul>
              <li>🟢 Compliant: 2 points</li>
              <li>🟡 Partially Compliant: 1 point</li>
              <li>🔴 Non-Compliant: 0 points</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="questionnaire-viewer">
      <div className="viewer-header">
        <h2>👁️ View & Test Your Questionnaire</h2>
        <p>Review the complete audit structure you've built</p>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`toggle-btn ${viewMode === 'hierarchy' ? 'active' : ''}`}
          onClick={() => setViewMode('hierarchy')}
        >
          🏗️ Hierarchy View
        </button>
        <button
          className={`toggle-btn ${viewMode === 'summary' ? 'active' : ''}`}
          onClick={() => setViewMode('summary')}
        >
          📊 Summary View
        </button>
      </div>

      {/* Content Area */}
      <div className="viewer-content">
        {viewMode === 'hierarchy' ? renderHierarchyView() : renderSummaryView()}
      </div>

      {/* Empty State */}
      {technologies.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Questionnaires Built Yet</h3>
          <p>Use the other tabs to build your audit structure</p>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireViewer;

