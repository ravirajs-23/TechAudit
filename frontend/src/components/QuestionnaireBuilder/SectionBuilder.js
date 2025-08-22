import React, { useState } from 'react';
import './SectionBuilder.css';

const SectionBuilder = ({ questions, sections, setSections }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weight: 1,
    selectedQuestions: []
  });

  const [showForm, setShowForm] = useState(false);
  const [dragSource, setDragSource] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionToggle = (questionId) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(questionId)
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Section title is required!');
      return;
    }

    // Questions are now optional - no validation needed
    // if (formData.selectedQuestions.length === 0) {
    //   alert('Please select at least one question for the section!');
    //   return;
    // }

    if (isEditMode && editingSection) {
      // Update existing section
      const updatedSection = {
        ...editingSection,
        ...formData,
        questions: questions.filter(q => formData.selectedQuestions.includes(q.id)),
        updatedAt: new Date().toISOString()
      };

      setSections(prev => prev.map(s => 
        s.id === editingSection.id ? updatedSection : s
      ));
      
      // Reset form and edit mode
      handleCancelEdit();
    } else {
      // Create new section
      const newSection = {
        id: Date.now().toString(),
        ...formData,
        questions: questions.filter(q => formData.selectedQuestions.includes(q.id)),
        createdAt: new Date().toISOString()
      };

      setSections(prev => [...prev, newSection]);
      setFormData({
        title: '',
        description: '',
        weight: 1,
        selectedQuestions: []
      });
      setShowForm(false);
    }
  };

  const handleDeleteSection = (sectionId) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      description: section.description,
      weight: section.weight,
      selectedQuestions: section.questions.map(q => q.id)
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setIsEditMode(false);
    setFormData({
      title: '',
      description: '',
      weight: 1,
      selectedQuestions: []
    });
    setShowForm(false);
  };

  const handleDragStart = (e, questionId) => {
    setDragSource(questionId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, questionId) => {
    e.preventDefault();
    if (dragSource && dragSource !== questionId) {
      handleQuestionToggle(questionId);
    }
    setDragSource(null);
  };

  return (
    <div className="section-builder">
      <div className="builder-header">
        <h2>📋 Build Sections from Questions</h2>
        <p>Group related questions into logical sections for your audit</p>
      </div>

      {/* Section Form */}
      <div className="section-form-container">
        {!showForm ? (
          <button 
            className="add-section-btn"
            onClick={() => setShowForm(true)}
          >
            ➕ Create New Section
          </button>
        ) : (
          <form className="section-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>{isEditMode ? 'Edit Section' : 'New Section'}</h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={isEditMode ? handleCancelEdit : () => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Section Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Authentication & Authorization"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this section covers..."
                  rows="2"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Section Weight (1-10)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Select Questions for this Section</label>
                <div className="questions-selector">
                  {questions.length === 0 ? (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                      No questions available. Create questions first to build sections.
                    </p>
                  ) : (
                    <div className="questions-grid">
                      {questions.map(question => (
                        <div
                          key={question.id}
                          className={`question-selector ${formData.selectedQuestions.includes(question.id) ? 'selected' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, question.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, question.id)}
                          onClick={() => handleQuestionToggle(question.id)}
                        >
                          <div className="question-text">{question.text}</div>
                          {question.evidenceRequired && (
                            <div className="question-meta">
                              <span className="evidence-required">Evidence: {question.evidenceRequired}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={isEditMode ? handleCancelEdit : () => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="primary">
                {isEditMode ? 'Update Section' : 'Create Section'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sections List */}
      <div className="sections-list">
        <h3>Created Sections ({sections.length})</h3>
        
        {sections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No sections created yet. Start building your audit structure!</p>
          </div>
        ) : (
          <div className="sections-grid">
            {sections.map((section) => (
              <div key={section.id} className="section-card">
                <div className="section-header">
                  <h4>{section.title}</h4>
                  <span className="weight-badge">
                    Weight: {section.weight}
                  </span>
                </div>
                
                {section.description && (
                  <div className="section-description">
                    {section.description}
                  </div>
                )}
                
                <div className="section-questions">
                  <strong>Questions ({section.questions.length}):</strong>
                  <div className="questions-list">
                    {section.questions.map(question => (
                      <div key={question.id} className="question-item">
                        <span className="question-text">{question.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="section-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditSection(section)}
                  >
                    ✏️ Edit Section
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    🗑️ Delete Section
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionBuilder;

