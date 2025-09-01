import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
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
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  QuestionAnswer as QuestionIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';

const Questions = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Questions component mounted');
    console.log('🔍 Auth state:', { user, isAuthenticated, token: !!token });
    console.log('🔍 Current pathname:', window.location.pathname);
  }, [user, isAuthenticated, token]);

  // Import questions from shared data
  // Note: In the future, this should be replaced with questionsData import
  // For now keeping existing structure to avoid breaking changes
  const staticQuestions = [
    {
      id: 1,
      text: "Is a documented cybersecurity policy in place for the organization?",
      guidance: "Review the written cybersecurity policy documentation and verify it is current and comprehensive.",
      evidenceRequired: "document",
      status: "active",
      createdAt: "2024-01-15",
      tags: ["security", "policy", "documentation"],
      category: "Security",
      priority: "High",
      lastModified: "2024-01-20"
    },
    {
      id: 2,
      text: "Are regular security awareness training sessions conducted for all employees?",
      guidance: "Check security training records, schedules, and attendance logs to verify compliance.",
      evidenceRequired: "document",
      status: "active",
      createdAt: "2024-01-14",
      tags: ["training", "security", "awareness"],
      category: "Security",
      priority: "High",
      lastModified: "2024-01-18"
    },
    {
      id: 3,
      text: "Are database access controls properly configured and monitored?",
      guidance: "Verify database user accounts, permissions, and access logging mechanisms are in place.",
      evidenceRequired: "screenshot",
      status: "active",
      createdAt: "2024-01-13",
      tags: ["database", "access-control", "monitoring"],
      category: "Security",
      priority: "Critical",
      lastModified: "2024-01-19"
    },
    {
      id: 4,
      text: "Is the backup and recovery system tested regularly?",
      guidance: "Review backup schedules, test results, and recovery procedures documentation.",
      evidenceRequired: "document",
      status: "active",
      createdAt: "2024-01-12",
      tags: ["backup", "recovery", "testing"],
      category: "Backup",
      priority: "High",
      lastModified: "2024-01-17"
    },
    {
      id: 5,
      text: "Are system vulnerabilities scanned and patched in a timely manner?",
      guidance: "Check vulnerability scanning reports and patch management procedures.",
      evidenceRequired: "log",
      status: "active",
      createdAt: "2024-01-11",
      tags: ["vulnerability", "patching", "scanning"],
      category: "Maintenance",
      priority: "Critical",
      lastModified: "2024-01-16"
    },
    {
      id: 6,
      text: "Is multi-factor authentication implemented for administrative accounts?",
      guidance: "Verify MFA configuration for all privileged and administrative user accounts.",
      evidenceRequired: "screenshot",
      status: "active",
      createdAt: "2024-01-10",
      tags: ["mfa", "authentication", "admin"],
      category: "Authentication",
      priority: "Critical",
      lastModified: "2024-01-15"
    },
    {
      id: 7,
      text: "Are network traffic and system activities monitored continuously?",
      guidance: "Review monitoring system configurations, alert settings, and log analysis procedures.",
      evidenceRequired: "screenshot",
      status: "active",
      createdAt: "2024-01-09",
      tags: ["monitoring", "network", "logging"],
      category: "Monitoring",
      priority: "Medium",
      lastModified: "2024-01-14"
    },
    {
      id: 8,
      text: "Is data encryption applied to sensitive information at rest and in transit?",
      guidance: "Verify encryption standards, key management, and data protection measures.",
      evidenceRequired: "document",
      status: "active",
      createdAt: "2024-01-08",
      tags: ["encryption", "data-protection", "compliance"],
      category: "Compliance",
      priority: "Critical",
      lastModified: "2024-01-13"
    },
    {
      id: 9,
      text: "Are incident response procedures documented and regularly tested?",
      guidance: "Review incident response plan, team roles, and recent drill exercises.",
      evidenceRequired: "document",
      status: "active",
      createdAt: "2024-01-07",
      tags: ["incident-response", "procedures", "testing"],
      category: "Security",
      priority: "High",
      lastModified: "2024-01-12"
    },
    {
      id: 10,
      text: "Is access to production systems properly segregated and controlled?",
      guidance: "Check production access controls, approval workflows, and segregation of duties.",
      evidenceRequired: "observation",
      status: "active",
      createdAt: "2024-01-06",
      tags: ["production", "access-control", "segregation"],
      category: "Security",
      priority: "High",
      lastModified: "2024-01-11"
    }
  ];

  const categories = ['Security', 'Maintenance', 'Authentication', 'Backup', 'Monitoring', 'Compliance'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  // Load static questions
  const loadQuestions = () => {
    setLoading(true);
    setError(null);

    // Simulate loading delay
    setTimeout(() => {
      setQuestions(staticQuestions);
      setFilteredQuestions(staticQuestions);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, selectedCategory, selectedPriority, questions]);

  const filterQuestions = () => {
    let filtered = questions.filter(question => {
      const matchesSearch = question.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.guidance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (question.tags && Array.isArray(question.tags) && question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || question.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });

    setFilteredQuestions(filtered);
    setPage(0);
  };

  const handleOpenDialog = (question = null) => {
    setEditingQuestion(question);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = (questionData) => {
    try {
      // Prepare question data
      const processedData = {
        ...questionData,
        lastModified: new Date().toISOString().split('T')[0],
        tags: questionData.tags ? questionData.tags.split(',').map(tag => tag.trim()) : [],
        status: 'active',
      };

      if (editingQuestion) {
        // Update existing question
        console.log('🔄 Updating question...');

        const updatedQuestions = questions.map(q =>
          q.id === editingQuestion.id ? { ...q, ...processedData } : q
        );
        setQuestions(updatedQuestions);
        console.log('✅ Question updated successfully!');
      } else {
        // Add new question
        console.log('🔄 Creating new question...');

        const newQuestion = {
          ...processedData,
          id: Math.max(...questions.map(q => q.id), 0) + 1,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setQuestions([...questions, newQuestion]);
        console.log('✅ Question created successfully!');
      }

      handleCloseDialog();
    } catch (err) {
      console.error('❌ Error saving question:', err);
      console.error(`❌ Failed to ${editingQuestion ? 'update' : 'create'} question`);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    try {
      console.log('🗑️ Deleting question...');

      // Update local state
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(updatedQuestions);
      console.log('✅ Question deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting question:', err);
      console.error('❌ Failed to delete question');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const QuestionForm = ({ question, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      text: question?.text || '',
      category: question?.category || '',
      priority: question?.priority || 'Medium',
      evidenceRequired: question?.evidenceRequired || true,
      guidance: question?.guidance || '',
      tags: question?.tags ? question.tags.join(', ') : '',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Question Text"
              multiline
              rows={3}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              helperText="Enter the audit question text"
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                label="Priority"
              >
                {priorities.map(priority => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Guidance"
              multiline
              rows={2}
              value={formData.guidance}
              onChange={(e) => setFormData({ ...formData, guidance: e.target.value })}
              helperText="Provide guidance for auditors on how to answer this question"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              helperText="Enter tags separated by commas (e.g., security, database, encryption)"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.evidenceRequired}
                  onChange={(e) => setFormData({ ...formData, evidenceRequired: e.target.checked })}
                />
              }
              label="Evidence Required"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {question ? 'Update Question' : 'Create Question'}
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Questions Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, edit, and manage audit questions for your questionnaires
          </Typography>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Loading questions...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="outlined"
              onClick={loadQuestions}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <QuestionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {questions.length}
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
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {questions.filter(q => q.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Questions
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
                    <PriorityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {questions.filter(q => q.priority === 'High' || q.priority === 'Critical').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Priority
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
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {new Set(questions.map(q => q.category)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categories
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {priorities.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadQuestions}
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Questions Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Evidence Required</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Modified</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question) => (
                    <TableRow key={question.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {question.text}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {question.tags && Array.isArray(question.tags) && question.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.category}
                          size="small"
                          variant="outlined"
                          icon={<CategoryIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.priority}
                          size="small"
                          color={getPriorityColor(question.priority)}
                          icon={<PriorityIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.evidenceRequired ? 'Yes' : 'No'}
                          size="small"
                          color={question.evidenceRequired ? 'success' : 'default'}
                          icon={question.evidenceRequired ? <CheckIcon /> : <InfoIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.status}
                          size="small"
                          color={getStatusColor(question.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {question.lastModified}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Question">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleOpenDialog(question)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Question">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <DeleteIcon />
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredQuestions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingQuestion ? 'Edit Question' : 'Create New Question'}
          </DialogTitle>
          <DialogContent>
            <QuestionForm
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>


      </Box>
    </Layout>
  );
};

export default Questions;
