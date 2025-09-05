import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
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
  CircularProgress,
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
  Security as SecurityIcon,
  Shield as ShieldIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import {
  dashboardStats,
  recentAudits,
  quickActions,
  getStatusConfig
} from '../../data/dashboardData';
import dataPersistenceService from '../../services/dataPersistenceService';
import DataManagementDialog from '../../components/DataManagement/DataManagementDialog';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          ...dashboardStats,
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
    <Card sx={{
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(0,0,0,0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        borderColor: 'rgba(0,0,0,0.12)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{
            bgcolor: color,
            mr: 2,
            width: 48,
            height: 48,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const AuditCard = ({ audit }) => (
    <Card sx={{
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(0,0,0,0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        borderColor: 'rgba(0,0,0,0.12)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{
            fontWeight: 'bold',
            lineHeight: 1.3,
            flex: 1,
            mr: 1
          }}>
            {audit.name}
          </Typography>
          {getStatusChip(audit.status)}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
            Technology: <span style={{ fontWeight: 600 }}>{audit.technology}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Auditor: <span style={{ fontWeight: 600 }}>{audit.auditor}</span>
          </Typography>
        </Box>

        {audit.progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Progress</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{audit.progress}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={audit.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {audit.status === 'completed' ? `Completed: ${audit.completedDate}` :
              audit.status === 'overdue' ? `Due: ${audit.dueDate}` :
                `Assigned: ${audit.assignedDate}`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                sx={{
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                }}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            {audit.status === 'pending' && (
              <Tooltip title="Start Audit">
                <IconButton
                  size="small"
                  sx={{
                    color: 'success.main',
                    '&:hover': { backgroundColor: 'success.light', color: 'white' }
                  }}
                >
                  <StartIcon />
                </IconButton>
              </Tooltip>
            )}
            {audit.status === 'in-progress' && (
              <Tooltip title="Edit Audit">
                <IconButton
                  size="small"
                  sx={{
                    color: 'warning.main',
                    '&:hover': { backgroundColor: 'warning.light', color: 'white' }
                  }}
                >
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
      navigate(action.path);
    };

    const iconMap = {
      'AddIcon': <AddIcon />
    };

    return (
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
          }
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar sx={{
            bgcolor: `${action.color}.main`,
            mx: 'auto',
            mb: 2,
            width: 56,
            height: 56,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            }
          }}>
            {iconMap[action.icon]}
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {action.title}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const SecurityMetricsCard = ({ title, value, icon, color, subtitle, progress }) => (
    <Card sx={{
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(0,0,0,0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        borderColor: 'rgba(0,0,0,0.12)',
      }
    }}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar sx={{
          bgcolor: color,
          mx: 'auto',
          mb: 2,
          width: 64,
          height: 64,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {icon}
        </Avatar>
        <Typography variant="h3" component="div" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          {value}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400, mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        {progress !== undefined && (
          <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={60}
              thickness={4}
              sx={{
                color: color,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                {progress}%
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Layout>
        <Box sx={{ flexGrow: 1 }}>
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

          {/* Security Metrics */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Security Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <SecurityMetricsCard
                  title="Compliance Score"
                  value={realTimeStats.complianceScore}
                  icon={<ShieldIcon />}
                  color="success.main"
                  subtitle="Overall security compliance"
                  progress={realTimeStats.complianceScore}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SecurityMetricsCard
                  title="Critical Vulnerabilities"
                  value={realTimeStats.criticalVulnerabilities}
                  icon={<BugReportIcon />}
                  color="error.main"
                  subtitle="Requires immediate attention"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SecurityMetricsCard
                  title="Technologies"
                  value={realTimeStats.totalTechnologies}
                  icon={<SecurityIcon />}
                  color="info.main"
                  subtitle="Monitored technologies"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SecurityMetricsCard
                  title="Questions"
                  value={realTimeStats.totalQuestions}
                  icon={<AssessmentIcon />}
                  color="warning.main"
                  subtitle="Available audit questions"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <QuickActionCard action={action} />
                </Grid>
              ))}
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
            <Paper sx={{
              p: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 3,
            }}>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: 'success.main',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        React.js Security Audit completed
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        John Doe completed the audit • 2 hours ago
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ mx: 0 }} />
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: 'warning.main',
                      boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                    }}>
                      <ScheduleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Node.js Backend Review started
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Jane Smith started the audit • 4 hours ago
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ mx: 0 }} />
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: 'info.main',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                    }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        New auditor assigned to AWS project
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Mike Johnson assigned • 1 day ago
                      </Typography>
                    }
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
