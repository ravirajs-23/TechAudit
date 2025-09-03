import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Card,
    CardContent,
    CardActions,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Divider,
    Alert,
    Snackbar,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Badge,
    Tooltip
} from '@mui/material';
import {
    NavigateNext as NextIcon,
    NavigateBefore as PrevIcon,
    Check as CheckIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Save as SaveIcon,
    ArrowBack as BackIcon
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';

const CreateQuestionnaire = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.state?.questionnaire;
    const editingQuestionnaire = location.state?.questionnaire;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        description: '',
        selectedSections: [],
        status: 'active'
    });

    // UI state
    const [activeStep, setActiveStep] = useState(0);
    const [sections, setSections] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [previewMode, setPreviewMode] = useState(false);

    // Load data on component mount
    useEffect(() => {
        loadData();
        if (isEditMode && editingQuestionnaire) {
            setFormData({
                name: editingQuestionnaire.name || '',
                version: editingQuestionnaire.version || '',
                description: editingQuestionnaire.description || '',
                selectedSections: editingQuestionnaire.sectionIds || [],
                status: editingQuestionnaire.status || 'active'
            });
        }
    }, [isEditMode, editingQuestionnaire]);

    const loadData = () => {
        try {
            const persistedSections = dataPersistenceService.loadSections();
            const persistedQuestions = dataPersistenceService.loadQuestions();

            // Filter only active sections
            const activeSections = persistedSections.filter(section => section.status === 'active');

            setSections(activeSections);
            setQuestions(persistedQuestions);

            console.log('🔍 Loaded sections:', activeSections.length);
            console.log('🔍 Loaded questions:', persistedQuestions.length);
        } catch (err) {
            console.error('❌ Error loading data:', err);
            showSnackbar('Error loading data', 'error');
        }
    };

    const steps = [
        {
            label: 'Basic Information',
            description: 'Set questionnaire name, version, and description'
        },
        {
            label: 'Select Sections',
            description: 'Choose sections to include in the questionnaire'
        },
        {
            label: 'Review & Save',
            description: 'Review the questionnaire and save it'
        }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
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

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handleSave();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSave = () => {
        try {
            if (!formData.name.trim()) {
                showSnackbar('Questionnaire name is required', 'error');
                return;
            }

            if (formData.selectedSections.length === 0) {
                showSnackbar('Please select at least one section', 'error');
                return;
            }

            const questionnaireData = {
                id: isEditMode ? editingQuestionnaire.id : dataPersistenceService.generateId(dataPersistenceService.loadQuestionnaires()),
                name: formData.name.trim(),
                version: formData.version.trim(),
                description: formData.description.trim(),
                sectionIds: formData.selectedSections,
                status: formData.status,
                createdAt: isEditMode ? editingQuestionnaire.createdAt : new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0],
                questionCount: getTotalQuestionCount(),
                sectionCount: formData.selectedSections.length
            };

            if (isEditMode) {
                dataPersistenceService.updateQuestionnaire(questionnaireData.id, questionnaireData);
                showSnackbar('Questionnaire updated successfully!', 'success');
            } else {
                dataPersistenceService.addQuestionnaire(questionnaireData);
                showSnackbar('Questionnaire created successfully!', 'success');
            }

            // Navigate back to questionnaires list
            setTimeout(() => {
                navigate('/questionnaires');
            }, 1500);

        } catch (err) {
            console.error('❌ Error saving questionnaire:', err);
            showSnackbar('Error saving questionnaire', 'error');
        }
    };

    const getTotalQuestionCount = () => {
        return formData.selectedSections.reduce((total, sectionId) => {
            const section = sections.find(s => s.id === sectionId);
            return total + (section?.questionCount || 0);
        }, 0);
    };

    const getSelectedSections = () => {
        return sections.filter(section => formData.selectedSections.includes(section.id));
    };

    const getQuestionsForSection = (sectionId) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section || !section.questionIds || !Array.isArray(section.questionIds)) return [];
        return questions.filter(question => section.questionIds.includes(question.id));
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const canProceedToNext = () => {
        switch (activeStep) {
            case 0:
                return formData.name.trim() && formData.version.trim();
            case 1:
                return formData.selectedSections.length > 0;
            default:
                return true;
        }
    };

    const renderBasicInfoStep = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Questionnaire Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Questionnaire Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Security Audit Questionnaire 2024"
                        required
                        helperText="Enter a descriptive name for the questionnaire"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Version"
                        value={formData.version}
                        onChange={(e) => handleInputChange('version', e.target.value)}
                        placeholder="e.g., 1.0, 2.1"
                        required
                        helperText="Version number for tracking changes"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe the purpose and scope of this questionnaire"
                        multiline
                        rows={4}
                        helperText="Provide a detailed description of what this questionnaire covers"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={formData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="archived">Archived</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );

    const renderSectionSelectionStep = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Select Sections
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose the sections you want to include in this questionnaire. You can select multiple sections.
            </Typography>

            {sections.length === 0 ? (
                <Alert severity="info">
                    No active sections found. Please create some sections first.
                </Alert>
            ) : (
                <List>
                    {sections.map((section) => (
                        <React.Fragment key={section.id}>
                            <ListItem>
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        checked={formData.selectedSections.includes(section.id)}
                                        onChange={() => handleSectionToggle(section.id)}
                                    />
                                </ListItemSecondaryAction>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {section.title}
                                            </Typography>
                                            <Chip
                                                size="small"
                                                label={`${section.questionCount} questions`}
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={section.priority}
                                                color={
                                                    section.priority === 'Critical' ? 'error' :
                                                        section.priority === 'High' ? 'warning' : 'default'
                                                }
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {section.description}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {formData.selectedSections.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Selected {formData.selectedSections.length} section(s) with {getTotalQuestionCount()} total questions
                </Alert>
            )}
        </Box>
    );

    const renderReviewStep = () => (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Review Questionnaire
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={previewMode ? <EditIcon /> : <ViewIcon />}
                    onClick={() => setPreviewMode(!previewMode)}
                >
                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                </Button>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {formData.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Version {formData.version}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {formData.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={`${formData.selectedSections.length} sections`} color="primary" />
                        <Chip label={`${getTotalQuestionCount()} questions`} color="secondary" />
                        <Chip label={formData.status} color="default" />
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
                Selected Sections
            </Typography>

            {getSelectedSections().map((section) => (
                <Accordion key={section.id} sx={{ mb: 1 }}>
                    <AccordionSummary>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {section.title}
                            </Typography>
                            <Chip size="small" label={`${section.questionCount} questions`} />
                            <Chip
                                size="small"
                                label={section.priority}
                                color={
                                    section.priority === 'Critical' ? 'error' :
                                        section.priority === 'High' ? 'warning' : 'default'
                                }
                            />
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {section.description}
                        </Typography>

                        {previewMode && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Questions in this section:
                                </Typography>
                                <List dense>
                                    {getQuestionsForSection(section.id).map((question) => (
                                        <ListItem key={question.id}>
                                            <ListItemText
                                                primary={question.text}
                                                secondary={`Type: ${question.type} | Priority: ${question.priority}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return renderBasicInfoStep();
            case 1:
                return renderSectionSelectionStep();
            case 2:
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/questionnaires')} sx={{ mr: 2 }}>
                    <BackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {isEditMode ? 'Edit Questionnaire' : 'Create Questionnaire'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {isEditMode ? 'Update questionnaire details and sections' : 'Build a new audit questionnaire'}
                    </Typography>
                </Box>
            </Box>

            {/* Stepper */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stepper activeStep={activeStep} orientation="horizontal">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        {step.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </Box>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {/* Step Content */}
            <Paper sx={{ mb: 3 }}>
                {renderStepContent()}
            </Paper>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    startIcon={<PrevIcon />}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    endIcon={activeStep === steps.length - 1 ? <SaveIcon /> : <NextIcon />}
                >
                    {activeStep === steps.length - 1 ? 'Save Questionnaire' : 'Next'}
                </Button>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateQuestionnaire;
