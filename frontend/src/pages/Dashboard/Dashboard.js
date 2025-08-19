import React from 'react';
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
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = {
    totalAudits: 24,
    completedAudits: 18,
    pendingAudits: 4,
    overdueAudits: 2,
  };

  const recentAudits = [
    {
      id: 1,
      name: 'React.js Security Audit',
      technology: 'React.js',
      status: 'completed',
      auditor: 'John Doe',
      completedDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Node.js Backend Review',
      technology: 'Node.js',
      status: 'in-progress',
      auditor: 'Jane Smith',
      dueDate: '2024-01-20',
    },
    {
      id: 3,
      name: 'AWS Infrastructure Assessment',
      technology: 'AWS',
      status: 'pending',
      auditor: 'Mike Johnson',
      assignedDate: '2024-01-10',
    },
  ];

  const getStatusChip = (status) => {
    const statusConfig = {
      completed: { color: 'success', icon: <CheckCircleIcon /> },
      'in-progress': { color: 'warning', icon: <ScheduleIcon /> },
      pending: { color: 'info', icon: <ScheduleIcon /> },
      overdue: { color: 'error', icon: <WarningIcon /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        icon={config.icon}
        label={status.replace('-', ' ').toUpperCase()}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, actionText, onClick, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick} color={color}>
          {actionText}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}! 👋
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your tech audits today.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Audits"
            value={stats.totalAudits}
            icon={<AssessmentIcon />}
            color="primary.main"
            subtitle="All time audits"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedAudits}
            icon={<CheckCircleIcon />}
            color="success.main"
            subtitle="Successfully completed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pendingAudits}
            icon={<ScheduleIcon />}
            color="warning.main"
            subtitle="Awaiting review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={stats.overdueAudits}
            icon={<ErrorIcon />}
            color="error.main"
            subtitle="Past due date"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Audits */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Audits
            </Typography>
            <List>
              {recentAudits.map((audit, index) => (
                <React.Fragment key={audit.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AssessmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {audit.name}
                          </Typography>
                          {getStatusChip(audit.status)}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Technology: {audit.technology}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Auditor: {audit.auditor}
                          </Typography>
                          {audit.completedDate && (
                            <Typography variant="body2" color="text.secondary">
                              Completed: {new Date(audit.completedDate).toLocaleDateString()}
                            </Typography>
                          )}
                          {audit.dueDate && (
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(audit.dueDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentAudits.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <QuickActionCard
                  title="Start New Audit"
                  description="Begin a new technology audit process"
                  actionText="Start Audit"
                  onClick={() => console.log('Start new audit')}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12}>
                <QuickActionCard
                  title="View Reports"
                  description="Access audit reports and analytics"
                  actionText="View Reports"
                  onClick={() => console.log('View reports')}
                  color="secondary"
                />
              </Grid>
              {isAdmin() && (
                <Grid item xs={12}>
                  <QuickActionCard
                    title="Manage Users"
                    description="Add, edit, or remove system users"
                    actionText="Manage Users"
                    onClick={() => console.log('Manage users')}
                    color="info"
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
