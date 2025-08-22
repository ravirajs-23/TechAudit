import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Build as BuildIcon,
  QuestionAnswer as QuestionIcon,
  ViewList as SectionIcon,
  Computer as TechnologyIcon,
} from '@mui/icons-material';
import Layout from '../Layout/Layout';
import QuestionCreator from './QuestionCreator';
import SectionBuilder from './SectionBuilder';
import QuestionnaireAssembler from './QuestionnaireAssembler';
import TechnologyConnector from './TechnologyConnector';
import QuestionnaireViewer from './QuestionnaireViewer';

const QuestionnaireBuilder = () => {
  const [activeModule, setActiveModule] = useState('questions');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const modules = [
    {
      id: 'questions',
      title: 'Questions',
      description: 'Create and manage audit questions',
      icon: <QuestionIcon />,
      color: 'primary',
    },
    {
      id: 'sections',
      title: 'Sections',
      description: 'Organize questions into logical sections',
      icon: <SectionIcon />,
      color: 'secondary',
    },
    {
      id: 'questionnaires',
      title: 'Questionnaires',
      description: 'Build complete audit questionnaires',
      icon: <BuildIcon />,
      color: 'success',
    },
    {
      id: 'technologies',
      title: 'Technologies',
      description: 'Manage technology profiles',
      icon: <TechnologyIcon />,
      color: 'info',
    },
    {
      id: 'viewer',
      title: 'Viewer',
      description: 'Preview and test questionnaires',
      icon: <ViewIcon />,
      color: 'warning',
    },
  ];

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
  };

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'questions':
        return <QuestionCreator onSnackbar={handleSnackbar} />;
      case 'sections':
        return <SectionBuilder onSnackbar={handleSnackbar} />;
      case 'questionnaires':
        return <QuestionnaireAssembler onSnackbar={handleSnackbar} />;
      case 'technologies':
        return <TechnologyConnector onSnackbar={handleSnackbar} />;
      case 'viewer':
        return <QuestionnaireViewer onSnackbar={handleSnackbar} />;
      default:
        return <QuestionCreator onSnackbar={handleSnackbar} />;
    }
  };

  const ModuleCard = ({ module }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: activeModule === module.id ? 2 : 1,
        borderColor: activeModule === module.id ? `${module.color}.main` : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: `${module.color}.main`,
        },
      }}
      onClick={() => handleModuleClick(module.id)}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${module.color}.main`,
              width: 64,
              height: 64,
              fontSize: '2rem',
            }}
          >
            {module.icon}
          </Avatar>
        </Box>
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
          {module.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {module.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Chip
          label={activeModule === module.id ? 'Active' : 'Click to Activate'}
          color={activeModule === module.id ? module.color : 'default'}
          variant={activeModule === module.id ? 'filled' : 'outlined'}
          size="small"
        />
      </CardActions>
    </Card>
  );

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Questionnaire Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Build comprehensive audit questionnaires using independent modules
          </Typography>
        </Box>

        {/* Module Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Select Module
          </Typography>
          <Grid container spacing={3}>
            {modules.map((module) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={module.id}>
                <ModuleCard module={module} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Active Module Content */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {modules.find(m => m.id === activeModule)?.title}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog(activeModule)}
            >
              Add New {modules.find(m => m.id === activeModule)?.title?.slice(0, -1)}
            </Button>
          </Box>
          
          <Paper sx={{ p: 3, minHeight: '400px' }}>
            {renderActiveModule()}
          </Paper>
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

export default QuestionnaireBuilder;

