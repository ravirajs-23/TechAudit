import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuestionsByIds, getAllQuestions } from '../../data/questionsData';
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
    InputAdornment,
    Checkbox,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Search as SearchIcon,
    LinkOff as UnlinkIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';

const CreateSection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editingSection = location.state?.editingSection;
    const isEditMode = !!editingSection;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questionIds: [],
    });
    const [questionSearch, setQuestionSearch] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Initialize form data when editing
    useEffect(() => {
        if (editingSection) {
            setFormData({
                title: editingSection.title || '',
                description: editingSection.description || '',
                questionIds: editingSection.questionIds || [],
            });
        }
    }, [editingSection]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            // Update existing section
            const updatedSection = {
                ...editingSection,
                ...formData,
                questionCount: formData.questionIds?.length || 0,
                lastModified: new Date().toISOString().split('T')[0],
            };

            // For demo purposes - in real app, this would be an API call
            setSnackbar({
                open: true,
                message: 'Section updated successfully!',
                severity: 'success'
            });
        } else {
            // Create new section
            const newSection = {
                id: Date.now(), // Simple ID generation for mock
                ...formData,
                status: 'active',
                questionCount: formData.questionIds?.length || 0,
                createdAt: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0],
                priority: 'Medium',
                completionRate: 0,
            };

            // For demo purposes - in real app, this would be an API call
            setSnackbar({
                open: true,
                message: 'Section created successfully!',
                severity: 'success'
            });
        }

        // Navigate back to sections page after a short delay
        setTimeout(() => {
            navigate('/sections');
        }, 1500);
    };

    const handleQuestionToggle = (questionId) => {
        const currentIds = formData.questionIds || [];
        const newQuestionIds = currentIds.includes(questionId)
            ? currentIds.filter(id => id !== questionId)
            : [...currentIds, questionId];

        setFormData({ ...formData, questionIds: newQuestionIds });
    };

    const getFilteredQuestions = () => {
        const allQuestions = getAllQuestions();
        if (!questionSearch.trim()) return allQuestions;

        const searchTerm = questionSearch.toLowerCase();
        return allQuestions.filter(question =>
            question.text.toLowerCase().includes(searchTerm) ||
            question.category.toLowerCase().includes(searchTerm) ||
            question.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    };

    const selectedQuestions = getQuestionsByIds(formData.questionIds || []);
    const availableQuestions = getFilteredQuestions();

    return (
        <Layout>
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => navigate('/sections')}
                            sx={{ mr: 2 }}
                        >
                            <BackIcon />
                        </IconButton>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            {isEditMode ? 'Edit Section' : 'Create New Section'}
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        {isEditMode
                            ? 'Update this audit section information and assigned questions'
                            : 'Create a new audit section and assign relevant questions to it'
                        }
                    </Typography>
                </Box>

                {/* Main Form */}
                <Paper sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Basic Information */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Basic Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Section Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    helperText="Enter a descriptive title for this section"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    helperText="Provide a detailed description of what this section covers"
                                />
                            </Grid>

                            {/* Questions Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                                    Questions Selection ({selectedQuestions.length} selected)
                                </Typography>

                                {/* Selected Questions Display */}
                                <Card sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Selected Questions:
                                    </Typography>
                                    {selectedQuestions.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {selectedQuestions.map((question) => (
                                                <Chip
                                                    key={question.id}
                                                    label={`${question.text.substring(0, 50)}...`}
                                                    onDelete={() => handleQuestionToggle(question.id)}
                                                    deleteIcon={<UnlinkIcon />}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No questions have been selected yet
                                        </Typography>
                                    )}
                                </Card>

                                {/* Question Search and Selection */}
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Select from Available Questions:
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search questions..."
                                        value={questionSearch}
                                        onChange={(e) => setQuestionSearch(e.target.value)}
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                        {availableQuestions.map((question) => {
                                            const isSelected = formData.questionIds?.includes(question.id);
                                            return (
                                                <Box
                                                    key={question.id}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        p: 2,
                                                        '&:hover': { bgcolor: 'action.hover' },
                                                        borderRadius: 1,
                                                        mb: 1,
                                                        border: isSelected ? '1px solid' : '1px solid transparent',
                                                        borderColor: isSelected ? 'primary.main' : 'transparent',
                                                        bgcolor: isSelected ? 'primary.50' : 'transparent'
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => handleQuestionToggle(question.id)}
                                                        size="small"
                                                    />
                                                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 'medium' : 'normal' }}>
                                                            {question.text}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                                            <Chip label={question.category} size="small" />
                                                            <Chip
                                                                label={question.priority}
                                                                size="small"
                                                                color={question.priority === 'Critical' ? 'error' : question.priority === 'High' ? 'warning' : 'default'}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                        {availableQuestions.length === 0 && questionSearch && (
                                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 2 }}>
                                                No questions found matching "{questionSearch}". Try different search terms.
                                            </Typography>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/sections')}
                                size="large"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="large"
                                disabled={!formData.title.trim() || !formData.description.trim()}
                            >
                                {isEditMode ? 'Update Section' : 'Create Section'}
                            </Button>
                        </Box>
                    </form>
                </Paper>

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

export default CreateSection;
