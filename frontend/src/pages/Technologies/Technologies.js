import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,

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
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [questionnaires, setQuestionnaires] = useState([]);

  // Mock questionnaires data
  const mockQuestionnaires = [
    {
      id: 1,
      title: 'Database Security Assessment',
      description: 'Comprehensive security evaluation for database systems',
      questionCount: 25,
      category: 'Database',
      estimatedTime: '45 minutes',
      status: 'active'
    },
    {
      id: 2,
      title: 'Identity Management Audit',
      description: 'Authentication and authorization systems review',
      questionCount: 18,
      category: 'Identity Management',
      estimatedTime: '30 minutes',
      status: 'active'
    },
    {
      id: 3,
      title: 'Web Server Security Check',
      description: 'Security configuration and vulnerability assessment',
      questionCount: 22,
      category: 'Web Server',
      estimatedTime: '35 minutes',
      status: 'active'
    },
    {
      id: 4,
      title: 'Network Security Review',
      description: 'Firewall and network infrastructure evaluation',
      questionCount: 30,
      category: 'Network Security',
      estimatedTime: '50 minutes',
      status: 'active'
    },
    {
      id: 5,
      title: 'Virtualization Platform Audit',
      description: 'Virtual infrastructure security assessment',
      questionCount: 20,
      category: 'Virtualization',
      estimatedTime: '40 minutes',
      status: 'active'
    },
    {
      id: 6,
      title: 'Container Security Assessment',
      description: 'Container orchestration and security evaluation',
      questionCount: 28,
      category: 'Container Orchestration',
      estimatedTime: '45 minutes',
      status: 'active'
    }
  ];

  // Mock data - in real app, this would come from API
  const mockTechnologies = [
    {
      id: 1,
      name: 'Oracle Database 19c',
      version: '19.3.0.0.0',
      category: 'Database',
      description: 'Enterprise database management system with advanced security features and comprehensive audit capabilities',
      status: 'active',
      assignedQuestionnaireId: 1, // One-to-one mapping
      lastUpdated: '2024-01-20',
      securityScore: 8.5,
      complianceStatus: 'Compliant',
      questionnaireCount: 3,
      auditCount: 8,

      features: [
        'Advanced Security Options',
        'Transparent Data Encryption',
        'Database Vault',
        'Audit Logging',
        'Role-Based Access Control'
      ],
      risks: [
        'Complex configuration management',
        'High licensing costs',
        'Requires specialized expertise',
        'Performance impact of security features'
      ],
      vulnerabilities: [
        'CVE-2023-21980 (Medium)',
        'CVE-2023-21955 (Low)'
      ],
      lastAuditDate: '2024-01-15',
      nextAuditDue: '2024-04-15'
    },
    {
      id: 2,
      name: 'Microsoft Active Directory',
      version: '2019',
      category: 'Identity Management',
      description: 'Centralized directory service for Windows domain networks providing authentication and authorization',
      status: 'active',
      assignedQuestionnaireId: 2, // One-to-one mapping
      lastUpdated: '2024-01-18',
      securityScore: 7.8,
      complianceStatus: 'Compliant',
      questionnaireCount: 2,
      auditCount: 12,

      features: [
        'Kerberos Authentication',
        'Group Policy Management',
        'LDAP Services',
        'Certificate Services',
        'Federation Services'
      ],
      risks: [
        'Single point of failure',
        'Privilege escalation vulnerabilities',
        'Complex delegation model',
        'Lateral movement risks'
      ],
      vulnerabilities: [
        'CVE-2023-28252 (High)',
        'CVE-2023-28229 (Medium)'
      ],
      lastAuditDate: '2024-01-10',
      nextAuditDue: '2024-04-10'
    },
    {
      id: 3,
      name: 'Apache Web Server',
      version: '2.4.54',
      category: 'Web Server',
      description: 'Open-source HTTP server for modern operating systems including UNIX and Windows',
      status: 'active',
      assignedQuestionnaireId: 3, // One-to-one mapping
      lastUpdated: '2024-01-16',
      securityScore: 8.2,
      complianceStatus: 'Compliant',
      questionnaireCount: 1,
      auditCount: 5,

      features: [
        'SSL/TLS Support',
        'Virtual Hosting',
        'URL Rewriting',
        'Load Balancing',
        'Security Modules'
      ],
      risks: [
        'Misconfigurations common',
        'Module vulnerabilities',
        'DDoS attack target',
        'Log file management issues'
      ],
      vulnerabilities: [
        'CVE-2023-25690 (Medium)',
        'CVE-2023-27522 (Low)'
      ],
      lastAuditDate: '2024-01-08',
      nextAuditDue: '2024-04-08'
    },
    {
      id: 4,
      name: 'Cisco ASA Firewall',
      version: '9.16.4',
      category: 'Network Security',
      description: 'Adaptive Security Appliance providing firewall, VPN, and intrusion prevention capabilities',
      status: 'active',
      assignedQuestionnaireId: 4, // One-to-one mapping
      lastUpdated: '2024-01-14',
      securityScore: 8.7,
      complianceStatus: 'Compliant',
      questionnaireCount: 2,
      auditCount: 6,

      features: [
        'Stateful Packet Inspection',
        'VPN Gateway',
        'Intrusion Prevention',
        'Application Control',
        'Identity-Based Policies'
      ],
      risks: [
        'Complex rule management',
        'Firmware vulnerabilities',
        'Configuration drift',
        'Performance bottlenecks'
      ],
      vulnerabilities: [
        'CVE-2023-20269 (High)',
        'CVE-2023-20185 (Medium)'
      ],
      lastAuditDate: '2024-01-12',
      nextAuditDue: '2024-04-12'
    },
    {
      id: 5,
      name: 'VMware vSphere',
      version: '7.0 U3',
      category: 'Virtualization',
      description: 'Enterprise virtualization platform for building cloud infrastructures',
      status: 'active',
      assignedQuestionnaireId: 5, // One-to-one mapping
      lastUpdated: '2024-01-13',
      securityScore: 8.0,
      complianceStatus: 'Needs Review',
      questionnaireCount: 3,
      auditCount: 7,

      features: [
        'Virtual Machine Management',
        'Resource Pooling',
        'High Availability',
        'Distributed Resource Scheduler',
        'vMotion Technology'
      ],
      risks: [
        'VM escape vulnerabilities',
        'Hypervisor attacks',
        'Resource contention',
        'Complex licensing model'
      ],
      vulnerabilities: [
        'CVE-2023-20867 (Critical)',
        'CVE-2023-20900 (High)'
      ],
      lastAuditDate: '2024-01-05',
      nextAuditDue: '2024-04-05'
    },
    {
      id: 6,
      name: 'MongoDB Enterprise',
      version: '6.0.3',
      category: 'Database',
      description: 'Document-oriented NoSQL database with enterprise security and management features',
      status: 'active',
      assignedQuestionnaireId: null, // No questionnaire assigned yet
      lastUpdated: '2024-01-11',
      securityScore: 7.9,
      complianceStatus: 'Compliant',
      questionnaireCount: 2,
      auditCount: 4,

      features: [
        'RBAC Authorization',
        'Field-Level Encryption',
        'Audit Logging',
        'LDAP Integration',
        'Kerberos Authentication'
      ],
      risks: [
        'Exposed default configurations',
        'NoSQL injection attacks',
        'Insufficient access controls',
        'Data consistency challenges'
      ],
      vulnerabilities: [
        'CVE-2023-1409 (Medium)'
      ],
      lastAuditDate: '2024-01-09',
      nextAuditDue: '2024-04-09'
    },
    {
      id: 7,
      name: 'Kubernetes',
      version: '1.25.4',
      category: 'Container Orchestration',
      description: 'Open-source container orchestration platform for automating deployment and management',
      status: 'active',
      assignedQuestionnaireId: 6, // One-to-one mapping
      lastUpdated: '2024-01-17',
      securityScore: 7.6,
      complianceStatus: 'Needs Review',
      questionnaireCount: 4,
      auditCount: 9,

      features: [
        'Pod Security Standards',
        'Network Policies',
        'RBAC',
        'Secrets Management',
        'Service Mesh Integration'
      ],
      risks: [
        'Misconfured RBAC',
        'Insecure container images',
        'Network policy gaps',
        'Secrets management issues'
      ],
      vulnerabilities: [
        'CVE-2023-2727 (High)',
        'CVE-2023-2728 (Medium)'
      ],
      lastAuditDate: '2024-01-07',
      nextAuditDue: '2024-04-07'
    }
  ];

  const categories = ['Database', 'Identity Management', 'Web Server', 'Network Security', 'Virtualization', 'Container Orchestration'];

  useEffect(() => {
    setTechnologies(mockTechnologies);
    setFilteredTechnologies(mockTechnologies);
    setQuestionnaires(mockQuestionnaires);
  }, []);

  useEffect(() => {
    filterTechnologies();
  }, [searchTerm, selectedCategory, technologies]);

  const filterTechnologies = () => {
    if (!technologies) return;

    let filtered = technologies.filter(technology => {
      const matchesSearch = technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technology.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || technology.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredTechnologies(filtered);
    setPage(0);
  };

  const handleCreateTechnology = () => {
    navigate('/technologies/create');
  };

  const handleEditTechnology = (technology) => {
    // Navigate to edit page with technology data
    navigate('/technologies/create', { state: { editingTechnology: technology } });
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

  // Helper functions for questionnaire assignment
  const getQuestionnaireById = (id) => {
    if (!questionnaires || !id) return null;
    return questionnaires.find(q => q.id === id);
  };



  const getComplianceColor = (status) => {
    switch (status) {
      case 'Compliant': return 'success';
      case 'Under Review': return 'warning';
      case 'Non-Compliant': return 'error';
      default: return 'default';
    }
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
                      {technologies?.length || 0}
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
                      {technologies?.filter(t => t.complianceStatus === 'Compliant').length || 0}
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
                      {technologies?.filter(t => t.securityScore < 8.0).length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Security Score
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

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTechnology}
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
                  <TableCell>Assigned Questionnaire</TableCell>
                  <TableCell>Security Score</TableCell>
                  <TableCell>Compliance</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredTechnologies || [])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((technology) => (
                    <TableRow key={technology.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {technology.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            v{technology.version}
                          </Typography>

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
                        {technology.assignedQuestionnaireId ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {getQuestionnaireById(technology.assignedQuestionnaireId)?.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getQuestionnaireById(technology.assignedQuestionnaireId)?.questionCount} questions
                            </Typography>
                          </Box>
                        ) : (
                          <Chip
                            label="No questionnaire"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
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
                              onClick={() => handleEditTechnology(technology)}
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
            count={filteredTechnologies?.length || 0}
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
                      {technology.category} • Score: {technology.securityScore}/10
                      {technology.assignedQuestionnaireId && (
                        <span> • Questionnaire: {getQuestionnaireById(technology.assignedQuestionnaireId)?.title}</span>
                      )}
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


                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>



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
