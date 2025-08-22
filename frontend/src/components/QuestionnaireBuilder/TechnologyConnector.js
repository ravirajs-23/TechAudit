import React, { useState } from 'react';

const TechnologyConnector = ({ questionnaires, technologies, setTechnologies }) => {
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    vendor: '',
    category: 'database',
    riskLevel: 'medium',
    description: '',
    selectedQuestionnaire: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const categories = [
    { value: 'database', label: '🗄️ Database' },
    { value: 'web', label: '🌐 Web Application' },
    { value: 'mobile', label: '📱 Mobile App' },
    { value: 'cloud', label: '☁️ Cloud Service' },
    { value: 'network', label: '🌐 Network Infrastructure' }
  ];

  const riskLevels = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🟠 High' },
    { value: 'critical', label: '🔴 Critical' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Technology name is required!');
      return;
    }

    if (!formData.selectedQuestionnaire) {
      alert('Please select a questionnaire for this technology!');
      return;
    }

    const selectedQ = questionnaires.find(q => q.id === formData.selectedQuestionnaire);
    
    if (isEditMode && editingTechnology) {
      // Update existing technology
      const updatedTechnology = {
        ...editingTechnology,
        ...formData,
        questionnaire: selectedQ,
        updatedAt: new Date().toISOString()
      };

      setTechnologies(prev => prev.map(t => 
        t.id === editingTechnology.id ? updatedTechnology : t
      ));
      
      // Reset form and edit mode
      handleCancelEdit();
    } else {
      // Create new technology
      const newTechnology = {
        id: Date.now().toString(),
        ...formData,
        questionnaire: selectedQ,
        createdAt: new Date().toISOString()
      };

      setTechnologies(prev => [...prev, newTechnology]);
      setFormData({
        name: '',
        version: '',
        vendor: '',
        category: 'database',
        riskLevel: 'medium',
        description: '',
        selectedQuestionnaire: ''
      });
      setShowForm(false);
    }
  };

  const handleEditTechnology = (technology) => {
    setEditingTechnology(technology);
    setFormData({
      name: technology.name,
      version: technology.version,
      vendor: technology.vendor,
      category: technology.category,
      riskLevel: technology.riskLevel,
      description: technology.description,
      selectedQuestionnaire: technology.questionnaire?.id || ''
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTechnology(null);
    setIsEditMode(false);
    setFormData({
      name: '',
      version: '',
      vendor: '',
      category: 'database',
      riskLevel: 'medium',
      description: '',
      selectedQuestionnaire: ''
    });
    setShowForm(false);
  };

  const handleDeleteTechnology = (technologyId) => {
    setTechnologies(prev => prev.filter(t => t.id !== technologyId));
  };

  return (
    <div className="technology-connector">
      <div className="builder-header">
        <h2>🔧 Connect Technology to Questionnaire</h2>
        <p>Link your audit questionnaire to specific technologies</p>
      </div>

      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '30px'
          }}
        >
          ➕ Connect New Technology
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{
          background: '#f8fafc',
          borderRadius: '15px',
          padding: '25px',
          border: '2px solid #e2e8f0',
          marginBottom: '30px'
        }}>
          <h3>{isEditMode ? 'Edit Technology' : 'New Technology'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label>Technology Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Oracle Database"
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
            <div>
              <label>Version</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                placeholder="e.g., 19c"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label>Vendor</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                placeholder="e.g., Oracle Corporation"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  marginTop: '5px'
                }}
              />
            </div>
            <div>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  marginTop: '5px'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Risk Level</label>
            <select
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '5px'
              }}
            >
              {riskLevels.map(risk => (
                <option key={risk.value} value={risk.value}>
                  {risk.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the technology and its purpose..."
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
            <label>Select Questionnaire *</label>
            <select
              name="selectedQuestionnaire"
              value={formData.selectedQuestionnaire}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '5px'
              }}
            >
              <option value="">Choose a questionnaire...</option>
              {questionnaires.map(q => (
                <option key={q.id} value={q.id}>
                  {q.title} v{q.version} ({q.sections.length} sections)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={isEditMode ? handleCancelEdit : () => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" style={{
              background: '#ec4899',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              {isEditMode ? 'Update Technology' : 'Connect Technology'}
            </button>
          </div>
        </form>
      )}

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3>Connected Technologies ({technologies.length})</h3>
        {technologies.length === 0 ? (
          <p>No technologies connected yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
            {technologies.map(tech => (
              <div key={tech.id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #f3f4f6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <h4>{tech.name} {tech.version}</h4>
                <p>Vendor: {tech.vendor}</p>
                <p>Category: {tech.category}</p>
                <p>Risk Level: {tech.riskLevel}</p>
                <p>Questionnaire: {tech.questionnaire?.title}</p>
                {tech.description && <p>{tech.description}</p>}
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  justifyContent: 'flex-end', 
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <button 
                    onClick={() => handleEditTechnology(tech)}
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
                    onClick={() => handleDeleteTechnology(tech.id)}
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

export default TechnologyConnector;

