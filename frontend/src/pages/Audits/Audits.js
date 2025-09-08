import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Grid,
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    PlayArrow as StartIcon,
    CheckCircle as CheckIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Assignment as AssignmentIcon,
    Business as ProjectIcon,
    Person as AuditorIcon,
    Assessment as AssessmentIcon,
    Description as ReportIcon
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';
import Layout from '../../components/Layout/Layout';

const Audits = () => {
    const navigate = useNavigate();
    const [audits, setAudits] = useState([]);
    const [filteredAudits, setFilteredAudits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

    // Filter audits when search term changes
    useEffect(() => {
        const filtered = audits.filter(audit =>
            (audit.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (audit.leadAuditor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (audit.status || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAudits(filtered);
        setPage(0); // Reset to first page when filtering
    }, [searchTerm, audits]);

    const loadData = () => {
        try {
            const persistedAudits = dataPersistenceService.loadAudits();
            setAudits(persistedAudits);
            console.log('🔍 Loaded audits:', persistedAudits.length);
        } catch (err) {
            console.error('❌ Error loading audits:', err);
            showSnackbar('Error loading audits', 'error');
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCreateAudit = () => {
        navigate('/audits/create');
    };

    const handleEditAudit = (audit) => {
        navigate(`/audits/${audit.id}/edit`);
    };

    const handleViewAudit = (audit) => {
        navigate(`/audits/${audit.id}/view`);
    };


    const handleViewReport = (audit) => {
        navigate(`/audits/${audit.id}/report`);
    };

    const handleDeleteAudit = (audit) => {
        setSelectedAudit(audit);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        try {
            dataPersistenceService.deleteAudit(selectedAudit.id);
            loadData();
            showSnackbar('Audit deleted successfully', 'success');
            setDeleteDialogOpen(false);
        } catch (err) {
            console.error('❌ Error deleting audit:', err);
            showSnackbar('Error deleting audit', 'error');
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

    const getProgressPercentage = (audit) => {
        switch (audit.status) {
            case 'planning': return 10;
            case 'in-progress': return 50;
            case 'review': return 80;
            case 'completed': return 100;
            case 'cancelled': return 0;
            default: return 0;
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleInitializeSampleData = () => {
        try {
            dataPersistenceService.forceInitializeAudits();
            loadData();
            showSnackbar('Sample audit data initialized successfully', 'success');
        } catch (err) {
            console.error('❌ Error initializing sample data:', err);
            showSnackbar('Error initializing sample data', 'error');
        }
    };

    const paginatedAudits = filteredAudits.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Layout>
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Audits Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage audit cycles, assign auditors, and track progress
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <AssignmentIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {audits.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Audits
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
                                        <AssignmentIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {audits.filter(a => a.status === 'in-progress').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            In Progress
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
                                            {audits.filter(a => a.status === 'completed').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Completed
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
                                        <ScheduleIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {audits.filter(a => a.status === 'planning').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Planning
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Action Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleInitializeSampleData}
                        sx={{ minWidth: 200 }}
                    >
                        Load Sample Data
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateAudit}
                        sx={{ minWidth: 200 }}
                    >
                        Initiate Audit
                    </Button>
                </Box>

                {/* Search */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search audits by project name, auditor, or status..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>

                {/* Audits Table */}
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Lead Auditor</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Timeline</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedAudits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                                                {searchTerm ? 'No audits match your search' : 'No audits found'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedAudits.map((audit) => (
                                        <TableRow key={audit.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
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
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 32, height: 32 }}>
                                                        <AuditorIcon />
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {audit.leadAuditor}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(audit.status)}
                                                    label={audit.status}
                                                    size="small"
                                                    color={getStatusColor(audit.status)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={getProgressPercentage(audit)}
                                                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                                    />
                                                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                                                        {getProgressPercentage(audit)}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {audit.startDate}
                                                </Typography>
                                                {audit.endDate && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        to {audit.endDate}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewAudit(audit)}
                                                            sx={{ color: 'info.main' }}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Audit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditAudit(audit)}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Audit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteAudit(audit)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {audit.status === 'completed' && (
                                                        <Tooltip title="View Report">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleViewReport(audit)}
                                                                sx={{ color: 'success.main' }}
                                                            >
                                                                <ReportIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredAudits.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the audit for "{selectedAudit?.projectName}"? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

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

export default Audits;
