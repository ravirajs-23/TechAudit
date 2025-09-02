import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
    Snackbar,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
} from '@mui/material';
import {
    Storage as StorageIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import dataPersistenceService from '../../services/dataPersistenceService';

const DataManagementDialog = ({ open, onClose }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmClear, setConfirmClear] = useState(false);

    const handleExportData = () => {
        try {
            const data = dataPersistenceService.exportAllData();
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `techaudit-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            setSnackbar({ open: true, message: 'Data exported successfully!', severity: 'success' });
        } catch (err) {
            console.error('❌ Error exporting data:', err);
            setSnackbar({ open: true, message: 'Failed to export data. Please try again.', severity: 'error' });
        }
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                dataPersistenceService.importData(data);
                setSnackbar({ open: true, message: 'Data imported successfully! Please refresh the page.', severity: 'success' });

                // Refresh the page after import
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (err) {
                console.error('❌ Error importing data:', err);
                setSnackbar({ open: true, message: 'Failed to import data. Please check the file format.', severity: 'error' });
            }
        };
        reader.readAsText(file);
    };

    const handleClearData = () => {
        try {
            dataPersistenceService.clearAllData();
            setSnackbar({ open: true, message: 'All data cleared successfully! Please refresh the page.', severity: 'success' });
            setConfirmClear(false);

            // Refresh the page after clearing
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error('❌ Error clearing data:', err);
            setSnackbar({ open: true, message: 'Failed to clear data. Please try again.', severity: 'error' });
        }
    };

    const getDataStats = () => {
        try {
            const questions = dataPersistenceService.loadQuestions();
            const sections = dataPersistenceService.loadSections();
            const technologies = dataPersistenceService.loadTechnologies();
            const questionnaires = dataPersistenceService.loadQuestionnaires();
            const audits = dataPersistenceService.loadAudits();

            return [
                { name: 'Questions', count: questions.length, key: 'questions' },
                { name: 'Sections', count: sections.length, key: 'sections' },
                { name: 'Technologies', count: technologies.length, key: 'technologies' },
                { name: 'Questionnaires', count: questionnaires.length, key: 'questionnaires' },
                { name: 'Audits', count: audits.length, key: 'audits' },
            ];
        } catch (err) {
            console.error('❌ Error getting data stats:', err);
            return [];
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StorageIcon />
                        <Typography variant="h6">Data Management</Typography>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Current Data Statistics</Typography>
                        <Paper sx={{ p: 2 }}>
                            <List dense>
                                {getDataStats().map((item, index) => (
                                    <React.Fragment key={item.key}>
                                        <ListItem>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={`${item.count} items stored`}
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="body2" color="primary">
                                                    {item.count}
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < getDataStats().length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Backup & Restore</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportData}
                            >
                                Export All Data
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                component="label"
                            >
                                Import Data
                                <input
                                    type="file"
                                    hidden
                                    accept=".json"
                                    onChange={handleImportData}
                                />
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Export your data as a JSON file for backup, or import previously exported data.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom color="error">Danger Zone</Typography>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Clearing all data will permanently delete all questions, sections, technologies, and other data.
                                This action cannot be undone.
                            </Typography>
                        </Alert>

                        {!confirmClear ? (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setConfirmClear(true)}
                            >
                                Clear All Data
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Typography variant="body2" color="error">
                                    Are you sure? This will delete all data permanently.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleClearData}
                                >
                                    Yes, Clear All Data
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setConfirmClear(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DataManagementDialog;
