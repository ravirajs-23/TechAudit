import React, { useState } from 'react';

const QuestionnaireAssembler = ({ sections, questionnaires, setQuestionnaires }) => {
  const [formData, setFormData] = useState({
    title: '',
    version: '1.0',
    description: '',
    selectedSections: []
  });

  const [showForm, setShowForm] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionToggle = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      selectedSections: prev.selectedSections.includes(sectionId)
        ? prev.selectedSections.filter(id => id !== sectionId)
        : [...prev.selectedSections, sectionId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Questionnaire title is required!');
      return;
    }

    if (formData.selectedSections.length === 0) {
      alert('Please select at least one section for the questionnaire!');
      return;
    }

    if (isEditMode && editingQuestionnaire) {
      // Update existing questionnaire
      const updatedQuestionnaire = {
        ...editingQuestionnaire,
        ...formData,
        sections: sections.filter(s => formData.selectedSections.includes(s.id)),
        updatedAt: new Date().toISOString()
      };

      setQuestionnaires(prev => prev.map(q => 
        q.id === editingQuestionnaire.id ? updatedQuestionnaire : q
      ));
      
      // Reset form and edit mode
      handleCancelEdit();
    } else {
      // Create new questionnaire
      const newQuestionnaire = {
        id: Date.now().toString(),
        ...formData,
        sections: sections.filter(s => formData.selectedSections.includes(s.id)),
        createdAt: new Date().toISOString()
      };

      setQuestionnaires(prev => [...prev, newQuestionnaire]);
      setFormData({
        title: '',
        version: '1.0',
        description: '',
        selectedSections: []
      });
      setShowForm(false);
    }
  };

  const handleEditQuestionnaire = (questionnaire) => {
    setEditingQuestionnaire(questionnaire);
    setFormData({
      title: questionnaire.title,
      version: questionnaire.version,
      description: questionnaire.description,
      selectedSections: questionnaire.sections.map(s => s.id)
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingQuestionnaire(null);
    setIsEditMode(false);
    setFormData({
      title: '',
      version: '1.0',
      description: '',
      selectedSections: []
    });
    setShowForm(false);
  };

  const handleDeleteQuestionnaire = (questionnaireId) => {
    setQuestionnaires(prev => prev.filter(q => q.id !== questionnaireId));
  };

  return (
    <div className="questionnaire-assembler">
      <div className="builder-header">
        <h2>📊 Assemble Questionnaire from Sections</h2>
        <p>Combine sections to create comprehensive audit questionnaires</p>
      </div>

      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '30px'
          }}
        >
          ➕ Create New Questionnaire
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{
          background: '#f8fafc',
          borderRadius: '15px',
          padding: '25px',
          border: '2px solid #e2e8f0',
          marginBottom: '30px'
        }}>
          <h3>{isEditMode ? 'Edit Questionnaire' : 'New Questionnaire'}</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Database Security Audit"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '5px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label>Version</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                placeholder="e.g., 1.0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  marginTop: '5px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the purpose and scope of this questionnaire..."
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '5px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Select Sections *</label>
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '15px',
              background: 'white'
            }}>
              {sections.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>
                  No sections available. Create sections first to build questionnaires.
                </p>
              ) : (
                sections.map(section => (
                  <div
                    key={section.id}
                    style={{
                      padding: '10px',
                      margin: '5px 0',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: formData.selectedSections.includes(section.id) ? '#f0fdf4' : 'white',
                      borderColor: formData.selectedSections.includes(section.id) ? '#10b981' : '#e5e7eb'
                    }}
                    onClick={() => handleSectionToggle(section.id)}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>{section.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {section.questions.length} questions • Weight: {section.weight}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={isEditMode ? handleCancelEdit : () => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" style={{
              background: '#f59e0b',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              {isEditMode ? 'Update Questionnaire' : 'Create Questionnaire'}
            </button>
          </div>
        </form>
      )}

      <div style={{ textAlign: 'center' }}>
        <h3>Created Questionnaires ({questionnaires.length})</h3>
        {questionnaires.length === 0 ? (
          <p>No questionnaires created yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
            {questionnaires.map(q => (
              <div key={q.id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #f3f4f6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <h4>{q.title}</h4>
                <p>Version: {q.version}</p>
                <p>Sections: {q.sections.length}</p>
                {q.description && <p>{q.description}</p>}
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  justifyContent: 'flex-end', 
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <button 
                    onClick={() => handleEditQuestionnaire(q)}
                    style={{
                      background: '#f0f9ff',
                      color: '#0369a1',
                      border: '1px solid #bae6fd',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestionnaire(q.id)}
                    style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
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

export default QuestionnaireAssembler;

