import React, { useState } from 'react';
import './QuestionCreator.css';

const QuestionCreator = ({ questions, setQuestions }) => {
  const [formData, setFormData] = useState({
    text: '',
    guidance: '',
    evidenceRequired: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      alert('Question text is required!');
      return;
    }

    if (isEditMode && editingQuestion) {
      // Update existing question
      const updatedQuestion = {
        ...editingQuestion,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? updatedQuestion : q
      ));
      
      // Reset form and edit mode
      handleCancelEdit();
    } else {
      // Create new question
      const newQuestion = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };

      setQuestions(prev => [...prev, newQuestion]);
      setFormData({
        text: '',
        guidance: '',
        evidenceRequired: ''
      });
      setShowForm(false);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      guidance: question.guidance,
      evidenceRequired: question.evidenceRequired
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setIsEditMode(false);
    setFormData({
      text: '',
      guidance: '',
      evidenceRequired: ''
    });
    setShowForm(false);
  };

  return (
    <div className="question-creator">
      <div className="creator-header">
        <h2>📝 Create Reusable Questions</h2>
        <p>Build questions that can be reused across different audit sections</p>
      </div>

      {/* Question Form */}
      <div className="question-form-container">
        {!showForm ? (
          <button 
            className="add-question-btn"
            onClick={() => setShowForm(true)}
          >
            ➕ Add New Question
          </button>
        ) : (
          <form className="question-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>{isEditMode ? 'Edit Question' : 'New Question'}</h3>
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
                <label>Question Text *</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  placeholder="Enter your audit question here..."
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Guidance</label>
                <textarea
                  name="guidance"
                  value={formData.guidance}
                  onChange={handleInputChange}
                  placeholder="Provide guidance on how to answer this question..."
                  rows="2"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Evidence Required</label>
                <select
                  name="evidenceRequired"
                  value={formData.evidenceRequired}
                  onChange={handleInputChange}
                >
                  <option value="">Select evidence requirement</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Optional">Optional</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={isEditMode ? handleCancelEdit : () => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="primary">
                {isEditMode ? 'Update Question' : 'Create Question'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Questions List */}
      <div className="questions-list">
        <h3>Created Questions ({questions.length})</h3>
        
        {questions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <p>No questions created yet. Start building your audit questions!</p>
          </div>
        ) : (
          <div className="questions-grid">
            {questions.map((question) => (
              <div key={question.id} className="question-card">
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
                
                <div className="question-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditQuestion(question)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    🗑️ Delete
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

export default QuestionCreator;

