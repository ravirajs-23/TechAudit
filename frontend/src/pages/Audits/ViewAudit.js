import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    Assignment as AssignmentIcon,
    Business as ProjectIcon,
    Person as AuditorIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Description as ReportIcon,
    Group as TeamIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';
import Layout from '../../components/Layout/Layout';

const ViewAudit = () => {
    const { auditId } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAuditData();
    }, [auditId]);

    const loadAuditData = () => {
        try {
            setLoading(true);
            const audits = dataPersistenceService.loadAudits();
            console.log('🔍 Available audits:', audits);
            console.log('🔍 Looking for audit ID:', auditId);

            const foundAudit = audits.find(a => a.id === auditId);

            if (foundAudit) {
                console.log('✅ Found audit:', foundAudit);
                setAudit(foundAudit);
            } else {
                console.log('❌ Audit not found. Available audits:', audits.map(a => ({ id: a.id, name: a.projectName })));
                setError(`Audit with ID "${auditId}" not found. Please load sample data first.`);
            }
        } catch (err) {
            console.error('Error loading audit:', err);
            setError('Failed to load audit data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/audits/${auditId}/edit`);
    };

    const handleExecute = () => {
        navigate(`/audits/${auditId}/execute`);
    };

    const handleViewReport = () => {
        navigate(`/audits/${auditId}/report`);
    };

    const handleLoadSampleData = () => {
        try {
            dataPersistenceService.forceInitializeAudits();
            // Navigate back to audits list
            navigate('/audits');
        } catch (err) {
            console.error('Error loading sample data:', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planning': return 'info';
            case 'in-progress': return 'warning';
            case 'review': return 'secondary';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'planning': return <ScheduleIcon />;
            case 'in-progress': return <AssignmentIcon />;
            case 'review': return <CheckIcon />;
            case 'completed': return <CheckIcon />;
            case 'cancelled': return <ErrorIcon />;
            default: return <ScheduleIcon />;
        }
    };

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<BackIcon />}
                            onClick={() => navigate('/audits')}
                        >
                            Back to Audits
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleLoadSampleData}
                        >
                            Load Sample Data
                        </Button>
                    </Box>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => navigate('/audits')}
                            sx={{ mr: 2 }}
                        >
                            <BackIcon />
                        </IconButton>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Audit Details
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        View audit information and progress
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    {audit.status !== 'completed' && (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                        >
                            Edit Audit
                        </Button>
                    )}
                    {audit.status === 'planning' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AssessmentIcon />}
                            onClick={handleExecute}
                        >
                            Start Audit
                        </Button>
                    )}
                    {audit.status === 'in-progress' && (
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<AssessmentIcon />}
                            onClick={handleExecute}
                        >
                            Continue Audit
                        </Button>
                    )}
                    {audit.status === 'completed' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<ReportIcon />}
                            onClick={handleViewReport}
                        >
                            View Report
                        </Button>
                    )}
                </Box>

                {/* Audit Information */}
                <Grid container spacing={3}>
                    {/* Project Information */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Project Information
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <ProjectIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {audit.projectName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {audit.clientName}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <AssignmentIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Questionnaire"
                                            secondary={audit.questionnaireName}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <ScheduleIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Timeline"
                                            secondary={`${audit.startDate} - ${audit.endDate || 'Ongoing'}`}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Audit Team */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Audit Team
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                        <AuditorIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Lead Auditor
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {audit.leadAuditor}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                {audit.teamMembers && audit.teamMembers.length > 0 && (
                                    <>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Team Members
                                        </Typography>
                                        <List dense>
                                            {audit.teamMembers.map((member, index) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <TeamIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={member.name}
                                                        secondary={member.role}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Status and Progress */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Status & Progress
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Chip
                                                icon={getStatusIcon(audit.status)}
                                                label={audit.status}
                                                color={getStatusColor(audit.status)}
                                                size="large"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {audit.description || 'No description provided'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Progress Overview
                                        </Typography>
                                        <List dense>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <ScheduleIcon color="info" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Planning"
                                                    secondary={audit.status === 'planning' ? 'Current' : 'Completed'}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <AssignmentIcon color={audit.status === 'in-progress' ? 'warning' : 'disabled'} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="In Progress"
                                                    secondary={audit.status === 'in-progress' ? 'Current' :
                                                        audit.status === 'completed' ? 'Completed' : 'Pending'}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckIcon color={audit.status === 'completed' ? 'success' : 'disabled'} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Completed"
                                                    secondary={audit.status === 'completed' ? 'Completed' : 'Pending'}
                                                />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default ViewAudit;
