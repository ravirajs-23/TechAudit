import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    Snackbar,
    IconButton,
    Avatar,
    Tooltip,
    Badge,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Share as ShareIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    ExpandMore as ExpandMoreIcon,
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Business as ProjectIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Check as SuccessIcon,
    Cancel as CancelIcon,
    Help as HelpIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import dataPersistenceService from '../../services/dataPersistenceService';

const AuditReport = () => {
    const { auditId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Data state
    const [audit, setAudit] = useState(null);
    const [questionnaire, setQuestionnaire] = useState(null);
    const [sections, setSections] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [auditAnswers, setAuditAnswers] = useState(null);

    // UI state
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showExportDialog, setShowExportDialog] = useState(false);

    // Load audit data
    useEffect(() => {
        loadAuditData();
    }, [auditId]);

    const loadAuditData = async () => {
        try {
            setLoading(true);

            // Load audit details
            const audits = dataPersistenceService.loadAudits();
            const currentAudit = audits.find(a => a.id === auditId);

            if (!currentAudit) {
                throw new Error('Audit not found');
            }

            setAudit(currentAudit);

            // Load questionnaire and related data
            const questionnaires = dataPersistenceService.loadQuestionnaires();
            const currentQuestionnaire = questionnaires.find(q => q.id === currentAudit.questionnaireId);

            if (!currentQuestionnaire) {
                throw new Error('Questionnaire not found');
            }

            setQuestionnaire(currentQuestionnaire);

            // Load sections and questions
            const allSections = dataPersistenceService.loadSections();
            const allQuestions = dataPersistenceService.loadQuestions();

            // Filter sections and questions for this questionnaire
            const questionnaireSections = allSections.filter(s =>
                currentQuestionnaire.sections?.includes(s.id)
            );

            const questionnaireQuestions = allQuestions.filter(q =>
                questionnaireSections.some(s => s.questions?.includes(q.id))
            );

            setSections(questionnaireSections);
            setQuestions(questionnaireQuestions);

            // Load audit answers
            const answers = dataPersistenceService.loadAuditAnswers(auditId);
            setAuditAnswers(answers);

            setLoading(false);
        } catch (error) {
            console.error('Error loading audit data:', error);
            showSnackbar('Error loading audit data', 'error');
            setLoading(false);
        }
    };

    const calculateSectionScore = (section) => {
        const sectionQuestions = questions.filter(q => section.questions?.includes(q.id));
        if (sectionQuestions.length === 0) return 0;

        let totalScore = 0;
        let answeredQuestions = 0;

        sectionQuestions.forEach(question => {
            const answer = auditAnswers?.answers?.[question.id];
            if (answer) {
                answeredQuestions++;
                switch (answer) {
                    case 'yes':
                        totalScore += 100;
                        break;
                    case 'partial':
                        totalScore += 50;
                        break;
                    case 'no':
                        totalScore += 0;
                        break;
                    case 'n/a':
                        totalScore += 100; // N/A counts as compliant
                        break;
                    default:
                        break;
                }
            }
        });

        return answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
    };

    const calculateOverallScore = () => {
        if (!sections.length) return 0;

        const sectionScores = sections.map(section => calculateSectionScore(section));
        const totalScore = sectionScores.reduce((sum, score) => sum + score, 0);
        return Math.round(totalScore / sections.length);
    };

    const getComplianceStatus = (score) => {
        if (score >= 90) return { status: 'Compliant', color: 'success', icon: <CheckIcon /> };
        if (score >= 70) return { status: 'Partially Compliant', color: 'warning', icon: <WarningIcon /> };
        return { status: 'Non-Compliant', color: 'error', icon: <ErrorIcon /> };
    };

    const getAnswerStats = () => {
        const answers = auditAnswers?.answers || {};
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(answers).length;

        const stats = {
            yes: 0,
            no: 0,
            partial: 0,
            na: 0,
            unanswered: totalQuestions - answeredQuestions
        };

        Object.values(answers).forEach(answer => {
            switch (answer) {
                case 'yes':
                    stats.yes++;
                    break;
                case 'no':
                    stats.no++;
                    break;
                case 'partial':
                    stats.partial++;
                    break;
                case 'n/a':
                    stats.na++;
                    break;
                default:
                    break;
            }
        });

        return stats;
    };

    const getFindings = () => {
        const findings = [];
        const answers = auditAnswers?.answers || {};

        questions.forEach(question => {
            const answer = answers[question.id];
            const evidence = auditAnswers?.evidence?.[question.id];
            const notes = auditAnswers?.notes?.[question.id];

            if (answer === 'no' || answer === 'partial') {
                findings.push({
                    question: question.text,
                    answer,
                    evidence,
                    notes,
                    severity: answer === 'no' ? 'High' : 'Medium',
                    section: sections.find(s => s.questions?.includes(question.id))?.title || 'Unknown'
                });
            }
        });

        return findings;
    };

    const getRecommendations = () => {
        const recommendations = [];
        const findings = getFindings();

        findings.forEach(finding => {
            if (finding.answer === 'no') {
                recommendations.push({
                    priority: 'High',
                    action: `Address compliance gap in ${finding.section}`,
                    description: `Implement controls to meet requirement: "${finding.question}"`,
                    timeline: 'Immediate action required'
                });
            } else if (finding.answer === 'partial') {
                recommendations.push({
                    priority: 'Medium',
                    action: `Improve compliance in ${finding.section}`,
                    description: `Enhance existing controls for: "${finding.question}"`,
                    timeline: 'Within 30 days'
                });
            }
        });

        return recommendations;
    };

    const handleExportReport = (format) => {
        // In a real implementation, this would generate and download the report
        showSnackbar(`Report exported as ${format}`, 'success');
        setShowExportDialog(false);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Generating report...
                    </Typography>
                </Box>
            </Layout>
        );
    }

    if (!audit || !questionnaire || !auditAnswers) {
        return (
            <Layout>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">
                        Audit data not found or incomplete. Please check the URL and try again.
                    </Alert>
                </Box>
            </Layout>
        );
    }

    const overallScore = calculateOverallScore();
    const complianceStatus = getComplianceStatus(overallScore);
    const answerStats = getAnswerStats();
    const findings = getFindings();
    const recommendations = getRecommendations();

    return (
        <Layout>
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => navigate('/audits')} sx={{ mr: 2 }}>
                                <BackIcon />
                            </IconButton>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                Audit Report: {audit.projectName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowExportDialog(true)}
                                startIcon={<DownloadIcon />}
                            >
                                Export Report
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => window.print()}
                                startIcon={<PrintIcon />}
                            >
                                Print
                            </Button>
                        </Box>
                    </Box>

                    <Typography variant="body1" color="text.secondary">
                        Generated on {new Date().toLocaleDateString()} by {user?.firstName} {user?.lastName}
                    </Typography>
                </Box>

                {/* Executive Summary */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Executive Summary
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: `${complianceStatus.color}.main`, mr: 2 }}>
                                            {complianceStatus.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {overallScore}%
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Overall Compliance Score
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={complianceStatus.status}
                                        color={complianceStatus.color}
                                        variant="outlined"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Project Details
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Project:</strong> {audit.projectName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Client:</strong> {audit.clientName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Lead Auditor:</strong> {audit.leadAuditor}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Questionnaire:</strong> {questionnaire.name} v{questionnaire.version}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Answer Statistics */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Answer Statistics
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                                        {answerStats.yes}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Compliant (Yes)
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                                        {answerStats.no}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Non-Compliant (No)
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                                        {answerStats.partial}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Partial Compliance
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                                        {answerStats.unanswered}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Unanswered
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Section Scores */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Section Scores
                    </Typography>

                    <Grid container spacing={2}>
                        {sections.map((section) => {
                            const sectionScore = calculateSectionScore(section);
                            const sectionStatus = getComplianceStatus(sectionScore);

                            return (
                                <Grid item xs={12} md={6} key={section.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {section.title}
                                                </Typography>
                                                <Chip
                                                    label={`${sectionScore}%`}
                                                    color={sectionStatus.color}
                                                    size="small"
                                                />
                                            </Box>

                                            <LinearProgress
                                                variant="determinate"
                                                value={sectionScore}
                                                color={sectionStatus.color}
                                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                            />

                                            <Typography variant="body2" color="text.secondary">
                                                {questions.filter(q => section.questions?.includes(q.id)).length} questions
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Paper>

                {/* Findings */}
                {findings.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Findings ({findings.length})
                        </Typography>

                        <List>
                            {findings.map((finding, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Avatar sx={{
                                                bgcolor: finding.severity === 'High' ? 'error.main' : 'warning.main',
                                                width: 32,
                                                height: 32
                                            }}>
                                                {finding.severity === 'High' ? <ErrorIcon /> : <WarningIcon />}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={finding.question}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Section:</strong> {finding.section} • <strong>Severity:</strong> {finding.severity}
                                                    </Typography>
                                                    {finding.evidence && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            <strong>Evidence:</strong> {finding.evidence}
                                                        </Typography>
                                                    )}
                                                    {finding.notes && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            <strong>Notes:</strong> {finding.notes}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < findings.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Recommendations ({recommendations.length})
                        </Typography>

                        <Grid container spacing={2}>
                            {recommendations.map((rec, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {rec.action}
                                                </Typography>
                                                <Chip
                                                    label={rec.priority}
                                                    color={rec.priority === 'High' ? 'error' : 'warning'}
                                                    size="small"
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {rec.description}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                <strong>Timeline:</strong> {rec.timeline}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* Detailed Results */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Detailed Results
                    </Typography>

                    {sections.map((section) => (
                        <Accordion key={section.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {section.title}
                                    </Typography>
                                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                        <Chip
                                            label={`${calculateSectionScore(section)}%`}
                                            color={getComplianceStatus(calculateSectionScore(section)).color}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Question</TableCell>
                                                <TableCell>Answer</TableCell>
                                                <TableCell>Evidence</TableCell>
                                                <TableCell>Notes</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {questions.filter(q => section.questions?.includes(q.id)).map((question) => {
                                                const answer = auditAnswers?.answers?.[question.id];
                                                const evidence = auditAnswers?.evidence?.[question.id];
                                                const notes = auditAnswers?.notes?.[question.id];

                                                return (
                                                    <TableRow key={question.id}>
                                                        <TableCell>{question.text}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={answer || 'Unanswered'}
                                                                color={answer === 'yes' ? 'success' :
                                                                    answer === 'no' ? 'error' :
                                                                        answer === 'partial' ? 'warning' : 'default'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {evidence ? (
                                                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                                                    {evidence}
                                                                </Typography>
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    No evidence
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {notes ? (
                                                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                                                    {notes}
                                                                </Typography>
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    No notes
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            </Box>

            {/* Export Dialog */}
            <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
                <DialogTitle>Export Report</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Choose the format for your audit report:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleExportReport('PDF')}
                                startIcon={<DownloadIcon />}
                            >
                                PDF Report
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleExportReport('Excel')}
                                startIcon={<DownloadIcon />}
                            >
                                Excel Report
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default AuditReport;
