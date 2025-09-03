import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ContentCopy as CloneIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckIcon,
    ViewList as SectionIcon,
    QuestionAnswer as QuestionIcon
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';
import Layout from '../../components/Layout/Layout';

const Questionnaires = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [questionnaires, setQuestionnaires] = useState([]);
    const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
    const [sections, setSections] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Load data on component mount and when location changes
    useEffect(() => {
        loadData();
    }, [location]);

    // Filter questionnaires when search term changes
    useEffect(() => {
        const filtered = questionnaires.filter(questionnaire =>
            (questionnaire.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (questionnaire.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (questionnaire.version || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuestionnaires(filtered);
        setPage(0); // Reset to first page when filtering
    }, [searchTerm, questionnaires]);

    const loadData = () => {
        try {
            const persistedQuestionnaires = dataPersistenceService.loadQuestionnaires();
            const persistedSections = dataPersistenceService.loadSections();
            const persistedQuestions = dataPersistenceService.loadQuestions();

            setQuestionnaires(persistedQuestionnaires);
            setSections(persistedSections);
            setQuestions(persistedQuestions);

            console.log('🔍 Loaded questionnaires:', persistedQuestionnaires.length);
        } catch (err) {
            console.error('❌ Error loading data:', err);
            showSnackbar('Error loading questionnaires', 'error');
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

    const handleCreateQuestionnaire = () => {
        navigate('/questionnaire/create');
    };

    const handleEditQuestionnaire = (questionnaire) => {
        navigate('/questionnaire/create', { state: { questionnaire } });
    };

    const handleDeleteQuestionnaire = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        try {
            dataPersistenceService.deleteQuestionnaire(selectedQuestionnaire.id);
            loadData();
            showSnackbar('Questionnaire deleted successfully', 'success');
            setDeleteDialogOpen(false);
        } catch (err) {
            console.error('❌ Error deleting questionnaire:', err);
            showSnackbar('Error deleting questionnaire', 'error');
        }
    };

    const handleCloneQuestionnaire = (questionnaire) => {
        try {
            const clonedQuestionnaire = {
                ...questionnaire,
                id: dataPersistenceService.generateId(dataPersistenceService.loadQuestionnaires()),
                name: `${questionnaire.name} (Copy)`,
                version: `${questionnaire.version}-copy`,
                createdAt: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0]
            };

            dataPersistenceService.addQuestionnaire(clonedQuestionnaire);
            loadData();
            showSnackbar('Questionnaire cloned successfully', 'success');
        } catch (err) {
            console.error('❌ Error cloning questionnaire:', err);
            showSnackbar('Error cloning questionnaire', 'error');
        }
    };

    const getSectionsForQuestionnaire = (questionnaire) => {
        if (!questionnaire.sectionIds || !Array.isArray(questionnaire.sectionIds)) {
            return [];
        }
        return sections.filter(section => questionnaire.sectionIds.includes(section.id));
    };

    const getQuestionsForSection = (sectionId) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section || !section.questionIds || !Array.isArray(section.questionIds)) return [];
        return questions.filter(question => section.questionIds.includes(question.id));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'draft': return 'warning';
            case 'archived': return 'default';
            default: return 'default';
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const paginatedQuestionnaires = filteredQuestionnaires.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Layout>
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Questionnaires
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage audit questionnaires and their configurations
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
                                            {questionnaires.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Questionnaires
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
                                            {questionnaires.filter(q => q.status === 'active').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Active Questionnaires
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
                                        <SectionIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {questionnaires.reduce((total, q) => total + (q.sectionCount || 0), 0)}
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
                                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                        <QuestionIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {questionnaires.reduce((total, q) => total + (q.questionCount || 0), 0)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Questions
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Action Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateQuestionnaire}
                        sx={{ minWidth: 200 }}
                    >
                        Create Questionnaire
                    </Button>
                </Box>

                {/* Search and Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search questionnaires by name, description, or version..."
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

                {/* Questionnaires Table */}
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Version</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Sections</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedQuestionnaires.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                                                {searchTerm ? 'No questionnaires match your search' : 'No questionnaires found'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedQuestionnaires.map((questionnaire) => (
                                        <TableRow key={questionnaire.id} hover>
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {questionnaire.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={questionnaire.version} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                                    {questionnaire.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${questionnaire.sectionCount || 0} sections`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={questionnaire.status}
                                                    size="small"
                                                    color={getStatusColor(questionnaire.status)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditQuestionnaire(questionnaire)}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Clone">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleCloneQuestionnaire(questionnaire)}
                                                            sx={{ color: 'info.main' }}
                                                        >
                                                            <CloneIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteQuestionnaire(questionnaire)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
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
                        count={filteredQuestionnaires.length}
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
                            Are you sure you want to delete "{selectedQuestionnaire?.name}"? This action cannot be undone.
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

export default Questionnaires;
