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
  Rating,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Computer as TechnologyIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Update as UpdateIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';

const Technologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data - in real app, this would come from API
  const mockTechnologies = [
    {
      id: 1,
      name: 'Oracle Database 19c',
      version: '19.3.0.0.0',
      vendor: 'Oracle Corporation',
      category: 'Database',
      riskLevel: 'High',
      description: 'Enterprise database management system with advanced security features',
      status: 'active',
      lastUpdated: '2024-01-20',
      securityScore: 8.5,
      complianceStatus: 'Compliant',
      questionnaireCount: 3,
      auditCount: 2,
      tags: ['database', 'enterprise', 'oracle', 'sql'],
      features: [
        'Advanced Security',
        'Data Encryption',
        'Audit Logging',
        'Access Control'
      ],
      risks: [
        'Complex configuration management',
        'High licensing costs',
        'Requires specialized expertise'
      ]
    },
    {
      id: 2,
      name: 'React.js',
      version: '18.2.0',
      vendor: 'Meta (Facebook)',
      category: 'Frontend Framework',
      riskLevel: 'Medium',
      description: 'JavaScript library for building user interfaces',
      status: 'active',
      lastUpdated: '2024-01-18',
      securityScore: 7.8,
      complianceStatus: 'Compliant',
      questionnaireCount: 2,
      auditCount: 1,
      tags: ['frontend', 'javascript', 'react', 'ui'],
      features: [
        'Component-based architecture',
        'Virtual DOM',
        'JSX support',
        'Hooks system'
      ],
      risks: [
        'Regular security updates required',
        'Dependency management complexity',
        'Performance optimization needed'
      ]
    },
    {
      id: 3,
      name: 'AWS EC2',
      version: 'Latest',
      vendor: 'Amazon Web Services',
      category: 'Cloud Infrastructure',
      riskLevel: 'High',
      description: 'Elastic Compute Cloud service for scalable computing capacity',
      status: 'active',
      lastUpdated: '2024-01-15',
      securityScore: 9.2,
      complianceStatus: 'Compliant',
      questionnaireCount: 4,
      auditCount: 3,
      tags: ['cloud', 'aws', 'infrastructure', 'compute'],
      features: [
        'Auto-scaling',
        'Load balancing',
        'Security groups',
        'IAM integration'
      ],
      risks: [
        'Complex security configuration',
        'Cost management challenges',
        'Shared responsibility model'
      ]
    },
    {
      id: 4,
      name: 'PostgreSQL',
      version: '15.4',
      vendor: 'PostgreSQL Global Development Group',
      category: 'Database',
      riskLevel: 'Medium',
      description: 'Advanced open-source relational database system',
      status: 'active',
      lastUpdated: '2024-01-12',
      securityScore: 8.0,
      complianceStatus: 'Compliant',
      questionnaireCount: 2,
      auditCount: 1,
      tags: ['database', 'open-source', 'postgresql', 'sql'],
      features: [
        'ACID compliance',
        'Extensibility',
        'Advanced indexing',
        'JSON support'
      ],
      risks: [
        'Community support dependency',
        'Performance tuning complexity',
        'Limited enterprise features'
      ]
    },
    {
      id: 5,
      name: 'Docker',
      version: '24.0.7',
      vendor: 'Docker Inc.',
      category: 'Containerization',
      riskLevel: 'Medium',
      description: 'Platform for developing, shipping, and running applications in containers',
      status: 'active',
      lastUpdated: '2024-01-10',
      securityScore: 7.5,
      complianceStatus: 'Under Review',
      questionnaireCount: 1,
      auditCount: 0,
      tags: ['containerization', 'devops', 'docker', 'microservices'],
      features: [
        'Container isolation',
        'Image management',
        'Orchestration support',
        'Registry integration'
      ],
      risks: [
        'Container security concerns',
        'Resource management',
        'Network complexity'
      ]
    },
  ];

  const categories = ['Database', 'Frontend Framework', 'Cloud Infrastructure', 'Containerization', 'Backend Framework', 'Security Tools', 'Monitoring', 'DevOps'];
  const riskLevels = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    setTechnologies(mockTechnologies);
    setFilteredTechnologies(mockTechnologies);
  }, []);

  useEffect(() => {
    filterTechnologies();
  }, [searchTerm, selectedCategory, selectedRiskLevel, technologies]);

  const filterTechnologies = () => {
    let filtered = technologies.filter(technology => {
      const matchesSearch = technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           technology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           technology.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || technology.category === selectedCategory;
      const matchesRiskLevel = selectedRiskLevel === 'all' || technology.riskLevel === selectedRiskLevel;
      
      return matchesSearch && matchesCategory && matchesRiskLevel;
    });
    
    setFilteredTechnologies(filtered);
    setPage(0);
  };

  const handleOpenDialog = (technology = null) => {
    setEditingTechnology(technology);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTechnology(null);
  };

  const handleSaveTechnology = (technologyData) => {
    if (editingTechnology) {
      // Update existing technology
      const updatedTechnologies = technologies.map(t => 
        t.id === editingTechnology.id ? { ...t, ...technologyData, lastUpdated: new Date().toISOString().split('T')[0] } : t
      );
      setTechnologies(updatedTechnologies);
      setSnackbar({ open: true, message: 'Technology updated successfully!', severity: 'success' });
    } else {
      // Add new technology
      const newTechnology = {
        id: Math.max(...technologies.map(t => t.id)) + 1,
        ...technologyData,
        status: 'active',
        securityScore: 7.0,
        complianceStatus: 'Under Review',
        questionnaireCount: 0,
        auditCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        tags: technologyData.tags ? technologyData.tags.split(',').map(tag => tag.trim()) : [],
        features: [],
        risks: [],
      };
      setTechnologies([...technologies, newTechnology]);
      setSnackbar({ open: true, message: 'Technology created successfully!', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleDeleteTechnology = (technologyId) => {
    const updatedTechnologies = technologies.filter(t => t.id !== technologyId);
    setTechnologies(updatedTechnologies);
    setSnackbar({ open: true, message: 'Technology deleted successfully!', severity: 'success' });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
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
      case 'deprecated': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'Compliant': return 'success';
      case 'Under Review': return 'warning';
      case 'Non-Compliant': return 'error';
      default: return 'default';
    }
  };

  const TechnologyForm = ({ technology, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: technology?.name || '',
      version: technology?.version || '',
      vendor: technology?.vendor || '',
      category: technology?.category || '',
      riskLevel: technology?.riskLevel || 'Medium',
      description: technology?.description || '',
      tags: technology?.tags ? technology.tags.join(', ') : '',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
            <TextField
              fullWidth
              label="Vendor"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              required
              helperText="Enter the vendor or developer name"
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
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                label="Risk Level"
              >
                {riskLevels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
              helperText="Provide a detailed description of the technology"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              helperText="Enter tags separated by commas (e.g., database, cloud, security)"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {technology ? 'Update Technology' : 'Create Technology'}
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
            Technologies Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage technology profiles and assess their security and compliance status
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <TechnologyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {technologies.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Technologies
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
                      {technologies.filter(t => t.complianceStatus === 'Compliant').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Compliant
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
                    <WarningIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {technologies.filter(t => t.riskLevel === 'High' || t.riskLevel === 'Critical').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Risk
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
                    <AssessmentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {technologies.reduce((total, t) => total + t.questionnaireCount, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Questionnaires
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
                placeholder="Search technologies..."
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
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={selectedRiskLevel}
                  onChange={(e) => setSelectedRiskLevel(e.target.value)}
                  label="Risk Level"
                >
                  <MenuItem value="all">All Risk Levels</MenuItem>
                  {riskLevels.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Technology
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Technologies Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Technology</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Security Score</TableCell>
                  <TableCell>Compliance</TableCell>
                  <TableCell>Questionnaires</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTechnologies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((technology) => (
                  <TableRow key={technology.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {technology.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {technology.vendor} • v{technology.version}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {technology.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                          {technology.tags.length > 3 && (
                            <Chip
                              label={`+${technology.tags.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={technology.category}
                        size="small"
                        variant="outlined"
                        icon={<CategoryIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={technology.riskLevel}
                        size="small"
                        color={getRiskLevelColor(technology.riskLevel)}
                        icon={<WarningIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {technology.securityScore}
                        </Typography>
                        <Rating
                          value={technology.securityScore / 2}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={technology.complianceStatus}
                        size="small"
                        color={getComplianceColor(technology.complianceStatus)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {technology.questionnaireCount}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(technology.questionnaireCount / 5) * 100}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {technology.lastUpdated}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Technology">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleOpenDialog(technology)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Technology">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteTechnology(technology.id)}
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
            count={filteredTechnologies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Technology Details Accordion */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Technology Details
          </Typography>
          {filteredTechnologies.slice(0, 3).map((technology) => (
            <Accordion key={technology.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <TechnologyIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {technology.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {technology.category} • Risk: {technology.riskLevel} • Score: {technology.securityScore}/10
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                    <Chip
                      label={technology.complianceStatus}
                      size="small"
                      color={getComplianceColor(technology.complianceStatus)}
                    />
                    <Chip
                      label={`${technology.questionnaireCount} questionnaires`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {technology.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Features:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {technology.features.map((feature, index) => (
                          <Typography key={index} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <CheckIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Risk Factors:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {technology.risks.map((risk, index) => (
                          <Typography key={index} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <WarningIcon sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
                            {risk}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {technology.tags.map((tag, index) => (
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
            {editingTechnology ? 'Edit Technology' : 'Create New Technology'}
          </DialogTitle>
          <DialogContent>
            <TechnologyForm
              technology={editingTechnology}
              onSave={handleSaveTechnology}
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

export default Technologies;
