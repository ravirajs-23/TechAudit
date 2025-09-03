import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { questionnairesData as mockQuestionnaires } from '../../data/questionnairesData';
import dataPersistenceService from '../../services/dataPersistenceService';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  InputAdornment,
  Radio,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  LinkOff as UnlinkIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';

const CreateTechnology = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTechnology = location.state?.editingTechnology;
  const isEditMode = !!editingTechnology;

  const [formData, setFormData] = useState({
    name: '',
    version: '',
    category: '',
    description: '',
    assignedQuestionnaireId: null,
  });
  const [questionnaireSearch, setQuestionnaireSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const categories = ['Database', 'Identity Management', 'Web Server', 'Network Security', 'Virtualization', 'Container Orchestration'];

  // Initialize form data when editing
  useEffect(() => {
    if (editingTechnology) {
      setFormData({
        name: editingTechnology.name || '',
        version: editingTechnology.version || '',
        category: editingTechnology.category || '',
        description: editingTechnology.description || '',
        assignedQuestionnaireId: editingTechnology.assignedQuestionnaireId || null,
      });
    }
  }, [editingTechnology]);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update existing technology using persistence service
        const updatedTechnology = dataPersistenceService.updateTechnology(editingTechnology.id, formData);

        if (updatedTechnology) {
          setSnackbar({
            open: true,
            message: 'Technology updated successfully!',
            severity: 'success'
          });
        } else {
          throw new Error('Failed to update technology');
        }
      } else {
        // Create new technology using persistence service
        const newTechnology = {
          ...formData,
          status: 'active',
          securityScore: 7.0,
          complianceStatus: 'Under Review',
          questionnaireCount: 0,
          auditCount: 0,
          features: [],
          risks: [],
        };

        const createdTechnology = dataPersistenceService.addTechnology(newTechnology);

        if (createdTechnology) {
          setSnackbar({
            open: true,
            message: 'Technology created successfully!',
            severity: 'success'
          });
        } else {
          throw new Error('Failed to create technology');
        }
      }

      // Navigate back to technologies page after a short delay
      setTimeout(() => {
        navigate('/technologies');
      }, 1500);
    } catch (err) {
      console.error('❌ Error saving technology:', err);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} technology. Please try again.`,
        severity: 'error'
      });
    }
  };

  // Helper functions for questionnaire assignment
  const getAvailableQuestionnaires = () => {
    try {
      // Load from persistence service
      return dataPersistenceService.loadQuestionnaires();
    } catch (err) {
      console.error('❌ Error loading questionnaires:', err);
      // Fallback to mock data
      return mockQuestionnaires;
    }
  };

  const getFilteredQuestionnaires = () => {
    const allQuestionnaires = getAvailableQuestionnaires();
    if (!questionnaireSearch.trim()) return allQuestionnaires;

    const searchTerm = (questionnaireSearch || '').toLowerCase();
    return allQuestionnaires.filter(questionnaire =>
      (questionnaire.title || '').toLowerCase().includes(searchTerm) ||
      (questionnaire.description || '').toLowerCase().includes(searchTerm) ||
      (questionnaire.category || '').toLowerCase().includes(searchTerm)
    );
  };

  const getQuestionnaireById = (id) => {
    if (!id) return null;
    return mockQuestionnaires.find(q => q.id === id);
  };

  const handleQuestionnaireToggle = (questionnaireId) => {
    // For single selection, just set the selected questionnaire
    setFormData({ ...formData, assignedQuestionnaireId: questionnaireId });
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={() => navigate('/technologies')}
              sx={{ mr: 2 }}
            >
              <BackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {isEditMode ? 'Edit Technology' : 'Create New Technology'}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {isEditMode
              ? 'Update this technology profile and its assigned questionnaire'
              : 'Create a new technology profile and assign questionnaires for assessment'
            }
          </Typography>
        </Box>

        {/* Main Form */}
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Technology Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  helperText="Enter the technology name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  helperText="Enter the version number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  helperText="Provide a detailed description of the technology"
                />
              </Grid>



              {/* Questionnaire Assignment */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                  Questionnaire Assignment {formData.assignedQuestionnaireId ? '(1 selected)' : ''}
                </Typography>

                {/* Selected Questionnaire Display */}
                <Card sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Questionnaire:
                  </Typography>
                  {formData.assignedQuestionnaireId ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={`${getQuestionnaireById(formData.assignedQuestionnaireId)?.title}`}
                        onDelete={() => setFormData({ ...formData, assignedQuestionnaireId: null })}
                        deleteIcon={<UnlinkIcon />}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No questionnaire has been selected yet
                    </Typography>
                  )}
                </Card>

                {/* Questionnaire Search and Selection */}
                <Card sx={{ p: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select from Available Questionnaires:
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search questionnaires..."
                    value={questionnaireSearch}
                    onChange={(e) => setQuestionnaireSearch(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {getFilteredQuestionnaires().map((questionnaire) => {
                      const isSelected = formData.assignedQuestionnaireId === questionnaire.id;
                      return (
                        <Box
                          key={questionnaire.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            '&:hover': { bgcolor: 'action.hover' },
                            borderRadius: 1,
                            mb: 1,
                            border: isSelected ? '1px solid' : '1px solid transparent',
                            borderColor: isSelected ? 'primary.main' : 'transparent',
                            bgcolor: isSelected ? 'primary.50' : 'transparent'
                          }}
                        >
                          <Radio
                            checked={isSelected}
                            onChange={() => handleQuestionnaireToggle(questionnaire.id)}
                            size="small"
                            name="questionnaire-selection"
                          />
                          <Box sx={{ flexGrow: 1, ml: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: isSelected ? 'medium' : 'normal' }}>
                              {questionnaire.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {questionnaire.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip label={questionnaire.category} size="small" />
                              <Chip
                                label={`${questionnaire.questionCount} questions`}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                              <Chip
                                label={questionnaire.estimatedTime}
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                    {getFilteredQuestionnaires().length === 0 && questionnaireSearch && (
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 2 }}>
                        No questionnaires found matching "{questionnaireSearch}". Try different search terms.
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/technologies')}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                size="large"
                disabled={!formData.name.trim() || !formData.description.trim() || !formData.category}
              >
                {isEditMode ? 'Update Technology' : 'Create Technology'}
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default CreateTechnology;
