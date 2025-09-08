import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    Snackbar
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';
import Layout from '../../components/Layout/Layout';

const EditAudit = () => {
    const { auditId } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form state
    const [formData, setFormData] = useState({
        projectName: '',
        clientName: '',
        leadAuditor: '',
        startDate: '',
        endDate: '',
        description: '',
        status: 'planning',
        teamMembers: []
    });

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
                setFormData({
                    projectName: foundAudit.projectName || '',
                    clientName: foundAudit.clientName || '',
                    leadAuditor: foundAudit.leadAuditor || '',
                    startDate: foundAudit.startDate || '',
                    endDate: foundAudit.endDate || '',
                    description: foundAudit.description || '',
                    status: foundAudit.status || 'planning',
                    teamMembers: foundAudit.teamMembers || []
                });
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Validate required fields
            if (!formData.projectName || !formData.leadAuditor || !formData.startDate) {
                showSnackbar('Please fill in all required fields', 'error');
                return;
            }

            // Update audit data
            const updatedAudit = {
                ...audit,
                ...formData,
                lastModified: new Date().toISOString()
            };

            // Save to persistence
            const audits = dataPersistenceService.loadAudits();
            const updatedAudits = audits.map(a =>
                a.id === auditId ? updatedAudit : a
            );
            dataPersistenceService.saveAudits(updatedAudits);

            showSnackbar('Audit updated successfully', 'success');

            // Navigate back to view page after a short delay
            setTimeout(() => {
                navigate(`/audits/${auditId}/view`);
            }, 1500);

        } catch (err) {
            console.error('Error saving audit:', err);
            showSnackbar('Failed to save audit', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/audits/${auditId}/view`);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleLoadSampleData = () => {
        try {
            dataPersistenceService.forceInitializeAudits();
            showSnackbar('Sample data loaded successfully. Please try editing again.', 'success');
            // Navigate back to audits list
            setTimeout(() => {
                navigate('/audits');
            }, 2000);
        } catch (err) {
            console.error('Error loading sample data:', err);
            showSnackbar('Error loading sample data', 'error');
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
                            onClick={() => navigate(`/audits/${auditId}/view`)}
                            sx={{ mr: 2 }}
                        >
                            <BackIcon />
                        </IconButton>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Edit Audit
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Modify audit information and settings
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                </Box>

                {/* Edit Form */}
                <Grid container spacing={3}>
                    {/* Project Information */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Project Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Project Name *"
                                            value={formData.projectName}
                                            onChange={(e) => handleInputChange('projectName', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Client Name"
                                            value={formData.clientName}
                                            onChange={(e) => handleInputChange('clientName', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                </Grid>
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
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Lead Auditor *"
                                            value={formData.leadAuditor}
                                            onChange={(e) => handleInputChange('leadAuditor', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={formData.status}
                                                label="Status"
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                            >
                                                <MenuItem value="planning">Planning</MenuItem>
                                                <MenuItem value="in-progress">In Progress</MenuItem>
                                                <MenuItem value="review">Review</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Timeline */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Timeline
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Start Date *"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="End Date"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Current Status Display */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Current Status
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip
                                        icon={<ScheduleIcon />}
                                        label={formData.status}
                                        color={getStatusColor(formData.status)}
                                        size="large"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Last modified: {audit.lastModified ? new Date(audit.lastModified).toLocaleString() : 'Unknown'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Snackbar */}
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

export default EditAudit;
