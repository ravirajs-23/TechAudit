import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  ViewList as SectionIcon,
  QuestionAnswer as QuestionIcon,
  Category as CategoryIcon,
  Scale as WeightIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data - in real app, this would come from API
  const mockSections = [
    {
      id: 1,
      title: 'Database Security',
      description: 'Core security controls for database access and data protection',
      category: 'Security',
      weight: 8,
      status: 'active',
      questionCount: 12,
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      tags: ['database', 'security', 'access-control'],
      questions: [
        'Is database encryption enabled and properly configured?',
        'Are database user accounts properly managed?',
        'Is database access logged and monitored?'
      ]
    },
    {
      id: 2,
      title: 'Network Infrastructure',
      description: 'Network security, monitoring, and infrastructure controls',
      category: 'Infrastructure',
      weight: 7,
      status: 'active',
      questionCount: 15,
      createdAt: '2024-01-10',
      lastModified: '2024-01-18',
      tags: ['network', 'infrastructure', 'monitoring'],
      questions: [
        'Is network traffic monitored for suspicious activity?',
        'Are firewalls properly configured and maintained?',
        'Is network segmentation implemented?'
      ]
    },
    {
      id: 3,
      title: 'User Access Management',
      description: 'User authentication, authorization, and access controls',
      category: 'Access Control',
      weight: 9,
      status: 'active',
      questionCount: 18,
      createdAt: '2024-01-12',
      lastModified: '2024-01-19',
      tags: ['access-control', 'authentication', 'users'],
      questions: [
        'Is multi-factor authentication implemented?',
        'Are user accounts reviewed regularly?',
        'Is privileged access properly controlled?'
      ]
    },
    {
      id: 4,
      title: 'Backup and Recovery',
      description: 'Data backup procedures and disaster recovery planning',
      category: 'Business Continuity',
      weight: 6,
      status: 'draft',
      questionCount: 8,
      createdAt: '2024-01-08',
      lastModified: '2024-01-15',
      tags: ['backup', 'recovery', 'disaster-planning'],
      questions: [
        'Are backup procedures tested regularly?',
        'Is disaster recovery plan documented?',
        'Are backup locations secure?'
      ]
    },
    {
      id: 5,
      title: 'Compliance Monitoring',
      description: 'Regulatory compliance and audit trail management',
      category: 'Compliance',
      weight: 5,
      status: 'active',
      questionCount: 10,
      createdAt: '2024-01-14',
      lastModified: '2024-01-21',
      tags: ['compliance', 'audit', 'regulations'],
      questions: [
        'Are compliance requirements documented?',
        'Is audit logging enabled and maintained?',
        'Are compliance reports generated regularly?'
      ]
    },
  ];

  const categories = ['Security', 'Infrastructure', 'Access Control', 'Business Continuity', 'Compliance', 'Operations'];
  const weightOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    setSections(mockSections);
    setFilteredSections(mockSections);
  }, []);

  useEffect(() => {
    filterSections();
  }, [searchTerm, selectedCategory, sections]);

  const filterSections = () => {
    let filtered = sections.filter(section => {
      const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredSections(filtered);
    setPage(0);
  };

  const handleOpenDialog = (section = null) => {
    setEditingSection(section);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSection(null);
  };

  const handleSaveSection = (sectionData) => {
    if (editingSection) {
      // Update existing section
      const updatedSections = sections.map(s => 
        s.id === editingSection.id ? { ...s, ...sectionData, lastModified: new Date().toISOString().split('T')[0] } : s
      );
      setSections(updatedSections);
      setSnackbar({ open: true, message: 'Section updated successfully!', severity: 'success' });
    } else {
      // Add new section
      const newSection = {
        id: Math.max(...sections.map(s => s.id)) + 1,
        ...sectionData,
        status: 'active',
        questionCount: 0,
        questions: [],
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        tags: sectionData.tags ? sectionData.tags.split(',').map(tag => tag.trim()) : [],
      };
      setSections([...sections, newSection]);
      setSnackbar({ open: true, message: 'Section created successfully!', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleDeleteSection = (sectionId) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    setSections(updatedSections);
    setSnackbar({ open: true, message: 'Section deleted successfully!', severity: 'success' });
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

  const getWeightColor = (weight) => {
    if (weight >= 8) return 'error';
    if (weight >= 6) return 'warning';
    if (weight >= 4) return 'info';
    return 'success';
  };

  const SectionForm = ({ section, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: section?.title || '',
      description: section?.description || '',
      category: section?.category || '',
      weight: section?.weight || 5,
      tags: section?.tags ? section.tags.join(', ') : '',
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
              label="Section Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              helperText="Enter a descriptive title for the section"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              helperText="Provide a detailed description of what this section covers"
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
              <InputLabel>Weight</InputLabel>
              <Select
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                label="Weight"
              >
                {weightOptions.map(weight => (
                  <MenuItem key={weight} value={weight}>
                    {weight} - {weight === 1 ? 'Lowest' : weight === 10 ? 'Highest' : 'Medium'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              helperText="Enter tags separated by commas (e.g., security, database, access-control)"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {section ? 'Update Section' : 'Create Section'}
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
                    <WeightIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {sections.reduce((total, s) => total + s.weight, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Weight
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search sections..."
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
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Section
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Sections Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Section</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Modified</TableCell>
                  <TableCell>Actions</TableCell>
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
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {section.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {section.tags.map((tag, index) => (
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
                        label={section.category}
                        size="small"
                        variant="outlined"
                        icon={<CategoryIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={section.weight}
                        size="small"
                        color={getWeightColor(section.weight)}
                        icon={<WeightIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {section.questionCount}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(section.questionCount / 20) * 100}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={section.status}
                        size="small"
                        color={getStatusColor(section.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {section.lastModified}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Section">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleOpenDialog(section)}
                          >
                            <EditIcon />
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSections.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Section Details Accordion */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Section Details
          </Typography>
          {filteredSections.slice(0, 3).map((section) => (
            <Accordion key={section.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <SectionIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.category} • Weight: {section.weight} • {section.questionCount} questions
                    </Typography>
                  </Box>
                  <Chip
                    label={section.status}
                    size="small"
                    color={getStatusColor(section.status)}
                    sx={{ mr: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {section.description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Questions in this section:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {section.questions.map((question, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <QuestionIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        {question}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {section.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingSection ? 'Edit Section' : 'Create New Section'}
          </DialogTitle>
          <DialogContent>
            <SectionForm
              section={editingSection}
              onSave={handleSaveSection}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
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
