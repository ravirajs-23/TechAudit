import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
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
    Avatar,
    ListItemAvatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    LinearProgress
} from '@mui/material';
import {
    NavigateNext as NextIcon,
    NavigateBefore as PrevIcon,
    Check as CheckIcon,
    Business as ProjectIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Save as SaveIcon,
    ArrowBack as BackIcon,
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    Technology as TechnologyIcon,
    QuestionAnswer as QuestionIcon
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';
import Layout from '../../components/Layout/Layout';

const CreateAudit = () => {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        projectId: '',
        leadAuditorId: '',
        teamMembers: [],
        startDate: '',
        endDate: '',
        description: '',
        status: 'planning'
    });

    // UI state
    const [activeStep, setActiveStep] = useState(0);
    const [projects, setProjects] = useState([]);
    const [auditors, setAuditors] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        try {
            // Load projects, auditors, technologies, and questionnaires
            const persistedProjects = dataPersistenceService.loadProjects();
            const persistedAuditors = dataPersistenceService.loadAuditors();
            const persistedTechnologies = dataPersistenceService.loadTechnologies();
            const persistedQuestionnaires = dataPersistenceService.loadQuestionnaires();
            
            setProjects(persistedProjects);
            setAuditors(persistedAuditors);
            setTechnologies(persistedTechnologies);
            setQuestionnaires(persistedQuestionnaires);
            
            console.log('🔍 Loaded data for audit creation');
        } catch (err) {
            console.error('❌ Error loading data:', err);
            showSnackbar('Error loading data', 'error');
        }
    };

    const steps = [
        {
            label: 'Select Project',
            description: 'Choose the project to audit'
        },
        {
            label: 'Select Questionnaire',
            description: 'Choose questionnaire based on project technology'
        },
        {
            label: 'Assign Auditor',
            description: 'Assign lead auditor and team members'
        },
        {
            label: 'Set Timeline',
            description: 'Set audit start and end dates'
        },
        {
            label: 'Review & Create',
            description: 'Review details and create audit'
        }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setFormData(prev => ({
            ...prev,
            projectId: project.id
        }));
    };

    const handleQuestionnaireSelect = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
    };

    const handleAuditorToggle = (auditorId) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.includes(auditorId)
                ? prev.teamMembers.filter(id => id !== auditorId)
                : [...prev.teamMembers, auditorId]
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
            if (!formData.projectId) {
                showSnackbar('Please select a project', 'error');
                return;
            }

            if (!formData.leadAuditorId) {
                showSnackbar('Please assign a lead auditor', 'error');
                return;
            }

            if (!selectedQuestionnaire) {
                showSnackbar('Please select a questionnaire', 'error');
                return;
            }

            const auditData = {
                id: dataPersistenceService.generateId(dataPersistenceService.loadAudits()),
                projectId: formData.projectId,
                projectName: selectedProject.name,
                clientName: selectedProject.client,
                leadAuditorId: formData.leadAuditorId,
                leadAuditor: auditors.find(a => a.id === formData.leadAuditorId)?.name || '',
                teamMembers: formData.teamMembers,
                questionnaireId: selectedQuestionnaire.id,
                questionnaireName: selectedQuestionnaire.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                description: formData.description,
                status: formData.status,
                createdAt: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0]
            };

            dataPersistenceService.addAudit(auditData);
            showSnackbar('Audit created successfully!', 'success');

            // Navigate back to audits list
            setTimeout(() => {
                navigate('/audits');
            }, 1500);

        } catch (err) {
            console.error('❌ Error creating audit:', err);
            showSnackbar('Error creating audit', 'error');
        }
    };

    const getQuestionnairesForTechnology = (technologyId) => {
        return questionnaires.filter(q => q.technologyId === technologyId);
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
                return !!formData.projectId;
            case 1:
                return !!selectedQuestionnaire;
            case 2:
                return !!formData.leadAuditorId;
            case 3:
                return formData.startDate && formData.endDate;
            default:
                return true;
        }
    };

    const renderProjectSelectionStep = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Select Project to Audit
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose the project that needs to be audited. The project's technology stack will determine available questionnaires.
            </Typography>

            {projects.length === 0 ? (
                <Alert severity="info">
                    No projects found. Please create some projects first.
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {projects.map((project) => (
                        <Grid item xs={12} md={6} key={project.id}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer',
                                    border: selectedProject?.id === project.id ? 2 : 1,
                                    borderColor: selectedProject?.id === project.id ? 'primary.main' : 'divider',
                                    bgcolor: selectedProject?.id === project.id ? 'primary.50' : 'background.paper',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'primary.50'
                                    }
                                }}
                                onClick={() => handleProjectSelect(project)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                            <ProjectIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {project.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {project.client}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        {project.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip label={project.status} size="small" color="primary" />
                                        {project.technology && (
                                            <Chip label={project.technology} size="small" color="secondary" />
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );

    const renderQuestionnaireSelectionStep = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Select Questionnaire
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose a questionnaire based on the project's technology stack.
            </Typography>

            {selectedProject && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Selected Project: <strong>{selectedProject.name}</strong> 
                    {selectedProject.technology && (
                        <> • Technology: <strong>{selectedProject.technology}</strong></>
                    )}
                </Alert>
            )}

            {questionnaires.length === 0 ? (
                <Alert severity="info">
                    No questionnaires found. Please create some questionnaires first.
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {questionnaires.map((questionnaire) => (
                        <Grid item xs={12} md={6} key={questionnaire.id}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer',
                                    border: selectedQuestionnaire?.id === questionnaire.id ? 2 : 1,
                                    borderColor: selectedQuestionnaire?.id === questionnaire.id ? 'primary.main' : 'divider',
                                    bgcolor: selectedQuestionnaire?.id === questionnaire.id ? 'primary.50' : 'background.paper',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'primary.50'
                                    }
                                }}
                                onClick={() => handleQuestionnaireSelect(questionnaire)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                            <QuestionIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {questionnaire.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Version {questionnaire.version}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        {questionnaire.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip label={`${questionnaire.sectionCount} sections`} size="small" color="primary" />
                                        <Chip label={`${questionnaire.questionCount} questions`} size="small" color="secondary" />
                                        <Chip label={questionnaire.status} size="small" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );

    const renderAuditorAssignmentStep = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Assign Auditor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select the lead auditor and team members for this audit.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Lead Auditor
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Select Lead Auditor</InputLabel>
                        <Select
                            value={formData.leadAuditorId}
                            onChange={(e) => handleInputChange('leadAuditorId', e.target.value)}
                            label="Select Lead Auditor"
                        >
                            {auditors.map((auditor) => (
                                <MenuItem key={auditor.id} value={auditor.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: 2 }}>
                                            <PersonIcon />
                                        </Avatar>
                                        {auditor.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Team Members
                    </Typography>
                    <List>
                        {auditors.map((auditor) => (
                            <ListItem key={auditor.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={auditor.name}
                                    secondary={auditor.role}
                                />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        checked={formData.teamMembers.includes(auditor.id)}
                                        onChange={() => handleAuditorToggle(auditor.id)}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    );

    const renderTimelineStep = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Set Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set the start and end dates for the audit cycle.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Audit Description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        multiline
                        rows={4}
                        placeholder="Describe the scope and objectives of this audit..."
                    />
                </Grid>
            </Grid>
        </Box>
    );

    const renderReviewStep = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Review Audit Details
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Project Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Name:</strong> {selectedProject?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Client:</strong> {selectedProject?.client}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Technology:</strong> {selectedProject?.technology}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Questionnaire Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Name:</strong> {selectedQuestionnaire?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Version:</strong> {selectedQuestionnaire?.version}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Sections:</strong> {selectedQuestionnaire?.sectionCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Auditor Assignment
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Lead Auditor:</strong> {auditors.find(a => a.id === formData.leadAuditorId)?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Team Members:</strong> {formData.teamMembers.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Timeline
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Start Date:</strong> {formData.startDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>End Date:</strong> {formData.endDate}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return renderProjectSelectionStep();
            case 1:
                return renderQuestionnaireSelectionStep();
            case 2:
                return renderAuditorAssignmentStep();
            case 3:
                return renderTimelineStep();
            case 4:
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => navigate('/audits')} sx={{ mr: 2 }}>
                        <BackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Initiate Audit
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Create a new audit cycle for a project
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
                        {activeStep === steps.length - 1 ? 'Create Audit' : 'Next'}
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
        </Layout>
    );
};

export default CreateAudit;
