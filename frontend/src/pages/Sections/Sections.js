import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { questionsData, getQuestionsByIds, getAllQuestions } from '../../data/questionsData';
import { sectionsData as mockSections } from '../../data/sectionsData';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  ViewList as SectionIcon,
  QuestionAnswer as QuestionIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  FileCopy as CloneIcon,
  Link as LinkIcon,
  LinkOff as UnlinkIcon,
  GridView as GridViewIcon,
  TableRows as TableViewIcon,
  Close as CloseIcon,
  ArrowBack as BackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';

const Sections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Reduced from 10 to 5
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedSection, setSelectedSection] = useState(null); // For detailed view
  const [viewQuestionsDialog, setViewQuestionsDialog] = useState(false);
  const [questionsDialogSection, setQuestionsDialogSection] = useState(null);
  const [expandedPreview, setExpandedPreview] = useState(null);

  // Mock data - in real app, this would come from API
  // Removed categories and weightOptions as they are no longer needed

  const loadSections = () => {
    try {
      const persistedSections = dataPersistenceService.loadSections();
      setSections(persistedSections);
      setFilteredSections(persistedSections);
    } catch (err) {
      console.error('❌ Error loading sections:', err);
      // Fallback to mock data if persistence fails
      setSections(mockSections);
      setFilteredSections(mockSections);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  // Reload sections when navigating back to this page
  useEffect(() => {
    loadSections();
  }, [location.pathname]);

  useEffect(() => {
    filterSections();
  }, [searchTerm, sections]);

  const filterSections = () => {
    let filtered = sections.filter(section => {
      const matchesSearch = (section.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (section.description || '').toLowerCase().includes(searchTerm.toLowerCase());



      return matchesSearch;
    });

    setFilteredSections(filtered);
    setPage(0);
  };

  const handleCreateSection = () => {
    navigate('/sections/create');
  };

  const handleEditSection = (section) => {
    // Navigate to edit page with section data
    navigate('/sections/create', { state: { editingSection: section } });
  };

  const handleDeleteSection = (sectionId) => {
    try {
      const success = dataPersistenceService.deleteSection(sectionId);

      if (success) {
        // Reload sections to get updated list
        const updatedSections = dataPersistenceService.loadSections();
        setSections(updatedSections);
        setSnackbar({ open: true, message: 'Section deleted successfully!', severity: 'success' });
      } else {
        throw new Error('Failed to delete section');
      }
    } catch (err) {
      console.error('❌ Error deleting section:', err);
      setSnackbar({ open: true, message: 'Failed to delete section. Please try again.', severity: 'error' });
    }
  };

  const handleCloneSection = (section) => {
    try {
      const clonedSection = {
        ...section,
        title: `${section.title} (Copy)`,
        completionRate: 0,
      };

      const newSection = dataPersistenceService.addSection(clonedSection);

      if (newSection) {
        // Reload sections to get updated list
        const updatedSections = dataPersistenceService.loadSections();
        setSections(updatedSections);
        setSnackbar({ open: true, message: 'Section cloned successfully!', severity: 'success' });
      } else {
        throw new Error('Failed to clone section');
      }
    } catch (err) {
      console.error('❌ Error cloning section:', err);
      setSnackbar({ open: true, message: 'Failed to clone section. Please try again.', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  // Handler for viewing questions in modal
  const handleViewQuestions = (section) => {
    setQuestionsDialogSection(section);
    setViewQuestionsDialog(true);
  };

  // Handler for closing questions dialog
  const handleCloseQuestionsDialog = () => {
    setViewQuestionsDialog(false);
    setQuestionsDialogSection(null);
  };





  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Sections Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize and manage audit sections to structure your questionnaires
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <SectionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {sections.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sections
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {sections.filter(s => s.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Sections
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <QuestionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {sections.reduce((total, s) => total + s.questionCount, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Questions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <SectionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {sections.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sections
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Compact Header with Actions */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flexGrow: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* View Mode Toggle */}
            <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                color={viewMode === 'table' ? 'primary' : 'default'}
              >
                <TableViewIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridViewIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSection}
              size="small"
            >
              Add Section
            </Button>
          </Box>
        </Paper>

        {/* Conditional Rendering: Table or Grid View */}
        {viewMode === 'table' ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Section</TableCell>
                    <TableCell align="center">Questions</TableCell>
                    <TableCell align="center">Priority</TableCell>
                    <TableCell align="center">Progress</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSections
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((section) => (
                      <TableRow key={section.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {section.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {section.description.substring(0, 60)}...
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={section.questionCount} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={section.priority}
                            size="small"
                            color={section.priority === 'Critical' ? 'error' : section.priority === 'High' ? 'warning' : 'info'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ mr: 1 }}>
                              {section.completionRate}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={section.completionRate}
                              sx={{ width: 40, height: 4 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="View Questions">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewQuestions(section)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditSection(section)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Clone">
                              <IconButton
                                size="small"
                                onClick={() => handleCloneSection(section)}
                              >
                                <CloneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={filteredSections.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              size="small"
            />
          </Paper>
        ) : (
          // Grid View
          <Box>
            <Grid container spacing={2}>
              {filteredSections
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((section) => (
                  <Grid item xs={12} sm={6} md={4} key={section.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 'medium' }}>
                            {section.title}
                          </Typography>
                          <Chip
                            label={section.priority}
                            size="small"
                            color={section.priority === 'Critical' ? 'error' : section.priority === 'High' ? 'warning' : 'info'}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '2.5em' }}>
                          {section.description.substring(0, 100)}...
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QuestionIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">{section.questionCount}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {section.completionRate}% complete
                          </Typography>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={section.completionRate}
                          sx={{ height: 6, borderRadius: 3, mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Questions">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewQuestions(section)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Section">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSection(section)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Clone Section">
                            <IconButton
                              size="small"
                              onClick={() => handleCloneSection(section)}
                            >
                              <CloneIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Section">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {/* Pagination for Grid View */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <TablePagination
                rowsPerPageOptions={[6, 12, 18]}
                component="div"
                count={filteredSections.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                size="small"
              />
            </Box>
          </Box>
        )}

        {/* Questions View Dialog */}
        <Dialog
          open={viewQuestionsDialog}
          onClose={handleCloseQuestionsDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { minHeight: '70vh' }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <QuestionIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" component="div">
                    {questionsDialogSection?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getQuestionsByIds(questionsDialogSection?.questionIds || []).length} questions in this section
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleCloseQuestionsDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {questionsDialogSection && (
              <Box>
                {/* Section Info */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {questionsDialogSection.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Priority: ${questionsDialogSection.priority}`}
                      color={questionsDialogSection.priority === 'Critical' ? 'error' : questionsDialogSection.priority === 'High' ? 'warning' : 'info'}
                      size="small"
                    />
                    <Chip
                      label={`Progress: ${questionsDialogSection.completionRate}%`}
                      color="success"
                      size="small"
                    />
                    <Chip
                      label={`Status: ${questionsDialogSection.status}`}
                      color={getStatusColor(questionsDialogSection.status)}
                      size="small"
                    />
                  </Box>
                </Paper>

                {/* Questions List */}
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <QuestionIcon sx={{ mr: 1 }} />
                  All Questions ({getQuestionsByIds(questionsDialogSection.questionIds || []).length})
                </Typography>

                {getQuestionsByIds(questionsDialogSection.questionIds || []).length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <QuestionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Questions Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No questions have been assigned to this section yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {getQuestionsByIds(questionsDialogSection.questionIds || []).map((question, index) => (
                      <Grid item xs={12} key={question.id}>
                        <Card sx={{ '&:hover': { elevation: 4 } }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" component="div" sx={{ fontSize: '1.1rem', fontWeight: 'medium', flex: 1 }}>
                                {index + 1}. {question.text}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                <Chip
                                  label={question.priority}
                                  size="small"
                                  color={question.priority === 'Critical' ? 'error' : question.priority === 'High' ? 'warning' : 'default'}
                                />
                                <Chip
                                  label={question.category}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {question.description}
                            </Typography>

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Evidence Required:</strong> {question.evidenceRequired}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Type:</strong> {question.type}
                                </Typography>
                                {question.complianceFramework && (
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Compliance Framework:</strong> {question.complianceFramework}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                {question.riskLevel && (
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Risk Level:</strong> {question.riskLevel}
                                  </Typography>
                                )}
                                {question.expectedResponse && (
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Expected Response:</strong> {question.expectedResponse}
                                  </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  Created: {question.createdAt}
                                </Typography>
                              </Grid>
                            </Grid>

                            {question.options && question.options.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                                  Options:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {question.options.map((option, optIndex) => (
                                    <Chip
                                      key={optIndex}
                                      label={option}
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseQuestionsDialog} variant="outlined">
              Close
            </Button>
            {questionsDialogSection && (
              <Button
                onClick={() => {
                  handleCloseQuestionsDialog();
                  handleEditSection(questionsDialogSection);
                }}
                variant="contained"
                startIcon={<EditIcon />}
              >
                Edit Section
              </Button>
            )}
          </DialogActions>
        </Dialog>



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

export default Sections;
