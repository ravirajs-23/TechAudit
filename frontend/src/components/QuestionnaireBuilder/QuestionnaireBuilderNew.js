import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Divider,
    Alert,
    Snackbar,
    IconButton,
    Chip,
    Card,
    CardContent,
    LinearProgress,
    Tabs,
    Tab,
    Badge,
} from '@mui/material';
import {
    QuestionAnswer as QuestionIcon,
    ViewList as SectionIcon,
    Build as BuildIcon,
    Computer as TechnologyIcon,
    NavigateNext as NextIcon,
    NavigateBefore as PrevIcon,
    CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import Layout from '../Layout/Layout';
import QuestionCreator from './QuestionCreator';
import SectionBuilder from './SectionBuilder';
import QuestionnaireAssembler from './QuestionnaireAssembler';
import TechnologyConnector from './TechnologyConnector';

const QuestionnaireBuilderNew = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // State for managing data across modules
    const [questions, setQuestions] = useState([]);
    const [sections, setSections] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [technologies, setTechnologies] = useState([]);

    const steps = [
        {
            id: 'questions',
            label: 'Create Questions',
            description: 'Build your audit question library',
            icon: <QuestionIcon />,
            color: 'primary',
            component: QuestionCreator,
            props: { questions, setQuestions },
            dataCount: questions.length,
        },
        {
            id: 'sections',
            label: 'Organize Sections',
            description: 'Group questions into logical sections',
            icon: <SectionIcon />,
            color: 'secondary',
            component: SectionBuilder,
            props: { questions, sections, setSections },
            dataCount: sections.length,
        },
        {
            id: 'questionnaires',
            label: 'Build Questionnaires',
            description: 'Create complete audit questionnaires',
            icon: <BuildIcon />,
            color: 'success',
            component: QuestionnaireAssembler,
            props: { sections, questionnaires, setQuestionnaires },
            dataCount: questionnaires.length,
        },
        {
            id: 'technologies',
            label: 'Assign Technologies',
            description: 'Link questionnaires to technology profiles',
            icon: <TechnologyIcon />,
            color: 'info',
            component: TechnologyConnector,
            props: { questionnaires, technologies, setTechnologies },
            dataCount: technologies.length,
        },
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepClick = (step) => {
        setActiveStep(step);
    };

    const handleSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStepProgress = () => {
        return ((activeStep + 1) / steps.length) * 100;
    };

    const isStepCompleted = (stepIndex) => {
        return steps[stepIndex].dataCount > 0;
    };

    const canProceedToNext = () => {
        const currentStep = steps[activeStep];
        return currentStep.dataCount > 0;
    };

    const renderStepContent = () => {
        const currentStep = steps[activeStep];
        const Component = currentStep.component;

        return (
            <Component
                {...currentStep.props}
                onSnackbar={handleSnackbar}
            />
        );
    };

    return (
        <Layout>
            <Box sx={{ flexGrow: 1 }}>
                {/* Header with Progress */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Questionnaire Builder
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Follow the step-by-step process to build comprehensive audit questionnaires
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={getStepProgress()}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Step {activeStep + 1} of {steps.length} - {Math.round(getStepProgress())}% Complete
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Sidebar Navigation */}
                    <Paper sx={{ width: 320, p: 2, height: 'fit-content', position: 'sticky', top: 20 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Build Process
                        </Typography>

                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((step, index) => (
                                <Step key={step.id} completed={isStepCompleted(index)}>
                                    <StepLabel
                                        icon={
                                            <Badge
                                                badgeContent={step.dataCount}
                                                color={step.color}
                                                invisible={step.dataCount === 0}
                                            >
                                                {isStepCompleted(index) ? <CompleteIcon color="success" /> : step.icon}
                                            </Badge>
                                        }
                                        onClick={() => handleStepClick(index)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: activeStep === index ? 'bold' : 'normal' }}>
                                                {step.label}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                            {step.dataCount > 0 && (
                                                <Chip
                                                    size="small"
                                                    label={`${step.dataCount} items`}
                                                    color={step.color}
                                                    variant="outlined"
                                                    sx={{ mt: 0.5 }}
                                                />
                                            )}
                                        </Box>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Navigation Buttons */}
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                startIcon={<PrevIcon />}
                                fullWidth
                            >
                                Previous Step
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={activeStep === steps.length - 1 || !canProceedToNext()}
                                endIcon={<NextIcon />}
                                fullWidth
                            >
                                {activeStep === steps.length - 1 ? 'Complete' : 'Next Step'}
                            </Button>

                            {!canProceedToNext() && activeStep < steps.length - 1 && (
                                <Alert severity="info" sx={{ mt: 1 }}>
                                    Add at least one item to proceed to the next step
                                </Alert>
                            )}
                        </Box>
                    </Paper>

                    {/* Main Content Area */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Card sx={{ minHeight: 600 }}>
                            <CardContent sx={{ p: 3 }}>
                                {/* Current Step Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                            bgcolor: `${steps[activeStep].color}.main`,
                                            color: 'white',
                                            mr: 2,
                                        }}
                                    >
                                        {steps[activeStep].icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {steps[activeStep].label}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {steps[activeStep].description}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Step Content */}
                                {renderStepContent()}
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Snackbar for notifications */}
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

export default QuestionnaireBuilderNew;

