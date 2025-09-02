import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout/Layout';
import {
  dashboardStats,
  recentAudits,
  securityMetrics,
  upcomingTasks,
  quickActions,
  getStatusConfig,
  getPriorityColor
} from '../../data/dashboardData';
import dataPersistenceService from '../../services/dataPersistenceService';
import DataManagementDialog from '../../components/DataManagement/DataManagementDialog';

const Dashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  console.log('🔍 Dashboard rendered');
  console.log('🔍 User:', user);
  console.log('🔍 Is Admin:', isAdmin);

  // Mock data - in real app, this would come from API
  const stats = dashboardStats;

  // Load data from persistence service for real-time stats
  const [realTimeStats, setRealTimeStats] = useState(stats);
  const [dataManagementOpen, setDataManagementOpen] = useState(false);

  useEffect(() => {
    const loadRealTimeStats = () => {
      try {
        const technologies = dataPersistenceService.loadTechnologies();
        const questions = dataPersistenceService.loadQuestions();
        const sections = dataPersistenceService.loadSections();

        // Calculate real-time stats
        const updatedStats = {
          ...stats,
          totalTechnologies: technologies.length,
          totalQuestions: questions.length,
          totalSections: sections.length,
        };

        setRealTimeStats(updatedStats);
      } catch (err) {
        console.error('❌ Error loading real-time stats:', err);
        // Keep using default stats if persistence fails
      }
    };

    loadRealTimeStats();
  }, []);

  const getStatusChip = (status) => {
    const statusConfig = getStatusConfig(status);
    const iconMap = {
      'CheckCircleIcon': <CheckCircleIcon />,
      'ScheduleIcon': <ScheduleIcon />,
      'WarningIcon': <WarningIcon />,
      'InfoIcon': <ErrorIcon />
    };
    return (
      <Chip
        icon={iconMap[statusConfig.icon]}
        label={statusConfig.label}
        color={statusConfig.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" color="success.main">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const AuditCard = ({ audit }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {audit.name}
          </Typography>
          {getStatusChip(audit.status)}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Technology: {audit.technology}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Auditor: {audit.auditor}
        </Typography>

        {audit.progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{audit.progress}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={audit.progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {audit.status === 'completed' ? `Completed: ${audit.completedDate}` :
              audit.status === 'overdue' ? `Due: ${audit.dueDate}` :
                `Assigned: ${audit.assignedDate}`}
          </Typography>

          <Box>
            <Tooltip title="View Details">
              <IconButton size="small" color="primary">
                <ViewIcon />
              </IconButton>
            </Tooltip>
            {audit.status === 'pending' && (
              <Tooltip title="Start Audit">
                <IconButton size="small" color="success">
                  <StartIcon />
                </IconButton>
              </Tooltip>
            )}
            {audit.status === 'in-progress' && (
              <Tooltip title="Edit Audit">
                <IconButton size="small" color="warning">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ action }) => {
    const handleClick = () => {
      console.log('🚀 QuickAction clicked:', action.title, 'Path:', action.path);
      console.log('🚀 Current URL:', window.location.href);

      // Show alert to confirm click is working
      alert(`Clicked: ${action.title} - Navigating to: ${action.path}`);

      // Use direct navigation instead of React Router
      window.location.href = action.path;
    };

    const iconMap = {
      'AddIcon': <AddIcon />
    };

    return (
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          }
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar sx={{ bgcolor: `${action.color}.main`, mx: 'auto', mb: 2, width: 56, height: 56 }}>
            {iconMap[action.icon]}
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {action.title}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Layout>
        <Box sx={{ flexGrow: 1 }}>
          {/* Debug Section - Remove in production */}
          <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
              🐛 Debug Information (Remove in Production)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  <strong>Auth State:</strong><br />
                  • isAuthenticated: {String(isAuthenticated)}<br />
                  • hasUser: {String(!!user)}<br />
                  • hasToken: {String(!!localStorage.getItem('token'))}<br />
                  • User Role: {user?.role || 'N/A'}<br />
                  • User ID: {user?.id || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  <strong>Current Route:</strong><br />
                  • Path: {window.location.pathname}<br />
                  • Hash: {window.location.hash}<br />
                  • Search: {window.location.search}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  console.log('🔍 Current auth state:', { isAuthenticated, user, token: localStorage.getItem('token') });
                  console.log('🔍 Current route:', window.location.pathname);
                  alert('Check console for debug info');
                }}
                sx={{ mr: 2 }}
              >
                Log Auth State to Console
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => setDataManagementOpen(true)}
              >
                Data Management
              </Button>
            </Box>
          </Box>

          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome back, {user?.firstName || 'User'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your tech audits today.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Audits"
                value={realTimeStats.totalAudits}
                icon={<AssessmentIcon />}
                color="primary.main"
                subtitle="All time"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={realTimeStats.completedAudits}
                icon={<CheckCircleIcon />}
                color="success.main"
                subtitle={`${realTimeStats.completionRate}% success rate`}
                trend="+12% this month"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="In Progress"
                value={realTimeStats.pendingAudits}
                icon={<ScheduleIcon />}
                color="warning.main"
                subtitle="Currently active"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Overdue"
                value={realTimeStats.overdueAudits}
                icon={<ErrorIcon />}
                color="error.main"
                subtitle="Requires attention"
              />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Actions
            </Typography>

            {/* Test Navigation Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  console.log('🧪 Test navigation button clicked');
                  alert('Test button clicked! Navigating to Questions...');
                  window.location.href = '/questions';
                }}
                sx={{ mr: 2 }}
              >
                🧪 Test Navigate to Questions
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  console.log('🧪 Test navigation button clicked');
                  alert('Test button clicked! Navigating to Dashboard...');
                  window.location.href = '/dashboard';
                }}
              >
                🧪 Test Back to Dashboard
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  alert('Simple test button works!');
                  console.log('✅ Simple test button clicked');
                }}
              >
                🧪 Simple Test
              </Button>
            </Box>

            <Grid container spacing={2}>
              {console.log('🔍 Rendering quickActions:', quickActions)}
              {quickActions.map((action, index) => {
                console.log('🔍 Rendering action:', action, 'at index:', index);
                return (
                  <Grid item xs={6} sm={3} key={index}>
                    <QuickActionCard action={action} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Recent Audits */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Recent Audits
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />}>
                New Audit
              </Button>
            </Box>
            <Grid container spacing={3}>
              {recentAudits.map((audit) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={audit.id}>
                  <AuditCard audit={audit} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Recent Activity */}
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Activity
            </Typography>
            <Paper sx={{ p: 2 }}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="React.js Security Audit completed"
                    secondary="John Doe completed the audit • 2 hours ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <ScheduleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Node.js Backend Review started"
                    secondary="Jane Smith started the audit • 4 hours ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="New auditor assigned to AWS project"
                    secondary="Mike Johnson assigned • 1 day ago"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>
      </Layout>

      {/* Data Management Dialog */}
      <DataManagementDialog
        open={dataManagementOpen}
        onClose={() => setDataManagementOpen(false)}
      />
    </>
  );
};

export default Dashboard;
