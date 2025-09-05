import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Chip,
  LinearProgress,
  IconButton,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  FileUpload as UploadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import dataPersistenceService from '../../services/dataPersistenceService';

const ExecuteAudit = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Audit data
  const [audit, setAudit] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  // Execution state
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evidence, setEvidence] = useState({});
  const [notes, setNotes] = useState({});
  const [auditStatus, setAuditStatus] = useState('in-progress');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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

      // Load existing answers if any
      const existingAnswers = dataPersistenceService.loadAuditAnswers(auditId);
      if (existingAnswers) {
        setAnswers(existingAnswers.answers || {});
        setEvidence(existingAnswers.evidence || {});
        setNotes(existingAnswers.notes || {});
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading audit data:', error);
      showSnackbar('Error loading audit data', 'error');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleEvidenceChange = (questionId, evidenceText) => {
    setEvidence(prev => ({
      ...prev,
      [questionId]: evidenceText
    }));
  };

  const handleNotesChange = (questionId, noteText) => {
    setNotes(prev => ({
      ...prev,
      [questionId]: noteText
    }));
  };

  const handleNextQuestion = () => {
    const currentSection = sections[currentSectionIndex];
    const sectionQuestions = questions.filter(q => 
      currentSection.questions?.includes(q.id)
    );

    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      const prevSection = sections[currentSectionIndex - 1];
      const prevSectionQuestions = questions.filter(q => 
        prevSection.questions?.includes(q.id)
      );
      setCurrentQuestionIndex(prevSectionQuestions.length - 1);
    }
  };

  const handleSaveProgress = async () => {
    try {
      setSaving(true);
      
      const auditData = {
        auditId,
        answers,
        evidence,
        notes,
        lastSaved: new Date().toISOString(),
        progress: calculateProgress()
      };

      dataPersistenceService.saveAuditAnswers(auditData);
      showSnackbar('Progress saved successfully', 'success');
      setSaving(false);
    } catch (error) {
      console.error('Error saving progress:', error);
      showSnackbar('Error saving progress', 'error');
      setSaving(false);
    }
  };

  const handleCompleteAudit = async () => {
    try {
      setSaving(true);
      
      // Save final answers
      await handleSaveProgress();
      
      // Update audit status
      const audits = dataPersistenceService.loadAudits();
      const updatedAudits = audits.map(a => 
        a.id === auditId 
          ? { ...a, status: 'completed', completedDate: new Date().toISOString() }
          : a
      );
      
      dataPersistenceService.saveAudits(updatedAudits);
      
      showSnackbar('Audit completed successfully!', 'success');
      
      setTimeout(() => {
        navigate('/audits');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing audit:', error);
      showSnackbar('Error completing audit', 'error');
      setSaving(false);
    }
  };

  const calculateProgress = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  };

  const getCurrentQuestion = () => {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return null;
    
    const sectionQuestions = questions.filter(q => 
      currentSection.questions?.includes(q.id)
    );
    
    return sectionQuestions[currentQuestionIndex];
  };

  const getQuestionStatus = (questionId) => {
    const hasAnswer = answers[questionId];
    const hasEvidence = evidence[questionId];
    const question = questions.find(q => q.id === questionId);
    
    if (!hasAnswer) return 'unanswered';
    if (question?.evidenceRequired && !hasEvidence) return 'needs-evidence';
    return 'complete';
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
            Loading audit...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!audit || !questionnaire) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Audit or questionnaire not found. Please check the URL and try again.
          </Alert>
        </Box>
      </Layout>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const progress = calculateProgress();

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Executing Audit: {audit.projectName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setShowSaveDialog(true)}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              >
                {saving ? 'Saving...' : 'Save Progress'}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteAudit}
                disabled={saving}
                startIcon={<CheckIcon />}
              >
                Complete Audit
              </Button>
            </Box>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Questionnaire: {questionnaire.name} v{questionnaire.version}
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Progress: {progress}% ({Object.keys(answers).length}/{questions.length} questions answered)
          </Typography>
        </Box>

        {/* Navigation Stepper */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stepper activeStep={currentSectionIndex} alternativeLabel>
            {sections.map((section, index) => (
              <Step key={section.id}>
                <StepLabel>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {section.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {questions.filter(q => section.questions?.includes(q.id)).length} questions
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Question Navigation */}
        {currentQuestion && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Section {currentSectionIndex + 1}: {sections[currentSectionIndex]?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestionIndex + 1} of {questions.filter(q => 
                  sections[currentSectionIndex]?.questions?.includes(q.id)
                ).length}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Current Question */}
        {currentQuestion && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                {currentQuestion.text}
              </Typography>
              
              {currentQuestion.guidance && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Guidance:</strong> {currentQuestion.guidance}
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* Answer Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Answer:
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel value="n/a" control={<Radio />} label="Not Applicable" />
                  <FormControlLabel value="partial" control={<Radio />} label="Partially Compliant" />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Evidence Upload */}
            {currentQuestion.evidenceRequired && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Evidence Required:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Describe the evidence that supports your answer..."
                  value={evidence[currentQuestion.id] || ''}
                  onChange={(e) => handleEvidenceChange(currentQuestion.id, e.target.value)}
                  helperText="Please provide detailed evidence to support your assessment"
                />
              </Box>
            )}

            {/* Notes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Additional Notes:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add any additional notes or observations..."
                value={notes[currentQuestion.id] || ''}
                onChange={(e) => handleNotesChange(currentQuestion.id, e.target.value)}
              />
            </Box>
          </Paper>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handlePrevQuestion}
            disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
            startIcon={<PrevIcon />}
          >
            Previous
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={currentSectionIndex === sections.length - 1 && 
                     currentQuestionIndex === questions.filter(q => 
                       sections[currentSectionIndex]?.questions?.includes(q.id)
                     ).length - 1}
            endIcon={<NextIcon />}
          >
            Next
          </Button>
        </Box>

        {/* Question Overview */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Question Overview
          </Typography>
          <Grid container spacing={2}>
            {sections.map((section, sectionIndex) => (
              <Grid item xs={12} md={6} key={section.id}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {section.title}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        {questions.filter(q => section.questions?.includes(q.id)).map(question => (
                          <Tooltip key={question.id} title={question.text}>
                            <Chip
                              size="small"
                              color={getQuestionStatus(question.id) === 'complete' ? 'success' : 
                                     getQuestionStatus(question.id) === 'needs-evidence' ? 'warning' : 'default'}
                              icon={getQuestionStatus(question.id) === 'complete' ? <CheckIcon /> : 
                                    getQuestionStatus(question.id) === 'needs-evidence' ? <WarningIcon /> : <InfoIcon />}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {questions.filter(q => section.questions?.includes(q.id)).map((question, qIndex) => (
                        <ListItem key={question.id}>
                          <ListItemIcon>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                              {qIndex + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={question.text}
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  size="small" 
                                  label={answers[question.id] || 'Unanswered'}
                                  color={answers[question.id] ? 'primary' : 'default'}
                                />
                                {question.evidenceRequired && (
                                  <Chip 
                                    size="small" 
                                    label={evidence[question.id] ? 'Evidence provided' : 'Evidence needed'}
                                    color={evidence[question.id] ? 'success' : 'warning'}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Save Progress Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Progress</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save your current progress? This will save all your answers, evidence, and notes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            handleSaveProgress();
            setShowSaveDialog(false);
          }} variant="contained">
            Save Progress
          </Button>
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

export default ExecuteAudit;
