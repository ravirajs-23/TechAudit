// Data persistence service for the application
// This service handles saving and loading data from localStorage
// Can be easily upgraded to use backend API later

class DataPersistenceService {
    constructor() {
        this.storageKeys = {
            questions: 'techaudit_questions',
            sections: 'techaudit_sections',
            technologies: 'techaudit_technologies',
            questionnaires: 'techaudit_questionnaires',
            projects: 'techaudit_projects',
            auditors: 'techaudit_auditors',
            audits: 'techaudit_audits',
            auditAnswers: 'techaudit_audit_answers'
        };
    }

    // Generic save method
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`✅ Data saved to ${key}:`, data);
            return true;
        } catch (error) {
            console.error(`❌ Error saving data to ${key}:`, error);
            return false;
        }
    }

    // Generic load method
    loadData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                console.log(`✅ Data loaded from ${key}:`, parsed);
                return parsed;
            }
            return defaultValue;
        } catch (error) {
            console.error(`❌ Error loading data from ${key}:`, error);
            return defaultValue;
        }
    }

    // Questions persistence
    saveQuestions(questions) {
        return this.saveData(this.storageKeys.questions, questions);
    }

    loadQuestions() {
        return this.loadData(this.storageKeys.questions, []);
    }

    addQuestion(question) {
        const questions = this.loadQuestions();
        const newQuestion = {
            ...question,
            id: this.generateId(questions),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        questions.push(newQuestion);
        this.saveQuestions(questions);
        return newQuestion;
    }

    updateQuestion(questionId, updatedData) {
        const questions = this.loadQuestions();
        const index = questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
            questions[index] = {
                ...questions[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveQuestions(questions);
            return questions[index];
        }
        return null;
    }

    deleteQuestion(questionId) {
        const questions = this.loadQuestions();
        const filtered = questions.filter(q => q.id !== questionId);
        this.saveQuestions(filtered);
        return true;
    }

    // Sections persistence
    saveSections(sections) {
        return this.saveData(this.storageKeys.sections, sections);
    }

    loadSections() {
        const sections = this.loadData(this.storageKeys.sections, []);
        console.log('🔍 Loaded sections from storage:', sections.length);
        return sections;
    }

    addSection(section) {
        const sections = this.loadSections();
        const newSection = {
            ...section,
            id: this.generateId(sections),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        sections.push(newSection);
        this.saveSections(sections);
        return newSection;
    }

    updateSection(sectionId, updatedData) {
        const sections = this.loadSections();
        const index = sections.findIndex(s => s.id === sectionId);
        if (index !== -1) {
            sections[index] = {
                ...sections[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveSections(sections);
            return sections[index];
        }
        return null;
    }

    deleteSection(sectionId) {
        const sections = this.loadSections();
        const filtered = sections.filter(s => s.id !== sectionId);
        this.saveSections(filtered);
        return true;
    }

    // Technologies persistence
    saveTechnologies(technologies) {
        return this.saveData(this.storageKeys.technologies, technologies);
    }

    loadTechnologies() {
        const technologies = this.loadData(this.storageKeys.technologies, []);
        console.log('🔍 Loaded technologies from storage:', technologies.length);
        return technologies;
    }

    addTechnology(technology) {
        const technologies = this.loadTechnologies();
        const newTechnology = {
            ...technology,
            id: this.generateId(technologies),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        technologies.push(newTechnology);
        this.saveTechnologies(technologies);
        return newTechnology;
    }

    updateTechnology(technologyId, updatedData) {
        const technologies = this.loadTechnologies();
        const index = technologies.findIndex(t => t.id === technologyId);
        if (index !== -1) {
            technologies[index] = {
                ...technologies[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveTechnologies(technologies);
            return technologies[index];
        }
        return null;
    }

    deleteTechnology(technologyId) {
        const technologies = this.loadTechnologies();
        const filtered = technologies.filter(t => t.id !== technologyId);
        this.saveTechnologies(filtered);
        return true;
    }

    // Questionnaires persistence
    saveQuestionnaires(questionnaires) {
        return this.saveData(this.storageKeys.questionnaires, questionnaires);
    }

    loadQuestionnaires() {
        return this.loadData(this.storageKeys.questionnaires, []);
    }

    addQuestionnaire(questionnaire) {
        const questionnaires = this.loadQuestionnaires();
        const newQuestionnaire = {
            ...questionnaire,
            id: this.generateId(questionnaires),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        questionnaires.push(newQuestionnaire);
        this.saveQuestionnaires(questionnaires);
        return newQuestionnaire;
    }

    updateQuestionnaire(questionnaireId, updatedData) {
        const questionnaires = this.loadQuestionnaires();
        const index = questionnaires.findIndex(q => q.id === questionnaireId);
        if (index !== -1) {
            questionnaires[index] = {
                ...questionnaires[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveQuestionnaires(questionnaires);
            return questionnaires[index];
        }
        return null;
    }

    deleteQuestionnaire(questionnaireId) {
        const questionnaires = this.loadQuestionnaires();
        const filtered = questionnaires.filter(q => q.id !== questionnaireId);
        this.saveQuestionnaires(filtered);
        return true;
    }

    // Projects persistence
    saveProjects(projects) {
        return this.saveData(this.storageKeys.projects, projects);
    }

    loadProjects() {
        return this.loadData(this.storageKeys.projects, []);
    }

    addProject(project) {
        const projects = this.loadProjects();
        const newProject = {
            ...project,
            id: this.generateId(projects),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        projects.push(newProject);
        this.saveProjects(projects);
        return newProject;
    }

    updateProject(projectId, updatedData) {
        const projects = this.loadProjects();
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveProjects(projects);
            return projects[index];
        }
        return null;
    }

    deleteProject(projectId) {
        const projects = this.loadProjects();
        const filtered = projects.filter(p => p.id !== projectId);
        this.saveProjects(filtered);
        return true;
    }

    // Auditors persistence
    saveAuditors(auditors) {
        return this.saveData(this.storageKeys.auditors, auditors);
    }

    loadAuditors() {
        return this.loadData(this.storageKeys.auditors, []);
    }

    addAuditor(auditor) {
        const auditors = this.loadAuditors();
        const newAuditor = {
            ...auditor,
            id: this.generateId(auditors),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        auditors.push(newAuditor);
        this.saveAuditors(auditors);
        return newAuditor;
    }

    updateAuditor(auditorId, updatedData) {
        const auditors = this.loadAuditors();
        const index = auditors.findIndex(a => a.id === auditorId);
        if (index !== -1) {
            auditors[index] = {
                ...auditors[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveAuditors(auditors);
            return auditors[index];
        }
        return null;
    }

    deleteAuditor(auditorId) {
        const auditors = this.loadAuditors();
        const filtered = auditors.filter(a => a.id !== auditorId);
        this.saveAuditors(filtered);
        return true;
    }

    // Audits persistence
    saveAudits(audits) {
        return this.saveData(this.storageKeys.audits, audits);
    }

    loadAudits() {
        return this.loadData(this.storageKeys.audits, []);
    }

    addAudit(audit) {
        const audits = this.loadAudits();
        const newAudit = {
            ...audit,
            id: this.generateId(audits),
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        audits.push(newAudit);
        this.saveAudits(audits);
        return newAudit;
    }

    updateAudit(auditId, updatedData) {
        const audits = this.loadAudits();
        const index = audits.findIndex(a => a.id === auditId);
        if (index !== -1) {
            audits[index] = {
                ...audits[index],
                ...updatedData,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.saveAudits(audits);
            return audits[index];
        }
        return null;
    }

    deleteAudit(auditId) {
        const audits = this.loadAudits();
        const filtered = audits.filter(a => a.id !== auditId);
        this.saveAudits(filtered);
        return true;
    }

    // Audit Answers persistence
    saveAuditAnswers(auditData) {
        const allAnswers = this.loadAllAuditAnswers();
        const existingIndex = allAnswers.findIndex(a => a.auditId === auditData.auditId);

        if (existingIndex !== -1) {
            allAnswers[existingIndex] = {
                ...allAnswers[existingIndex],
                ...auditData,
                lastModified: new Date().toISOString()
            };
        } else {
            allAnswers.push({
                ...auditData,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            });
        }

        return this.saveData(this.storageKeys.auditAnswers, allAnswers);
    }

    loadAuditAnswers(auditId) {
        const allAnswers = this.loadAllAuditAnswers();
        return allAnswers.find(a => a.auditId === auditId) || null;
    }

    loadAllAuditAnswers() {
        return this.loadData(this.storageKeys.auditAnswers, []);
    }

    deleteAuditAnswers(auditId) {
        const allAnswers = this.loadAllAuditAnswers();
        const filtered = allAnswers.filter(a => a.auditId !== auditId);
        return this.saveData(this.storageKeys.auditAnswers, filtered);
    }

    // Utility methods
    generateId(items) {
        if (items.length === 0) return 1;
        const maxId = Math.max(...items.map(item => item.id));
        return maxId + 1;
    }

    // Initialize with default data if storage is empty
    initializeWithDefaults() {
        try {
            // Import default data
            const { questionsData } = require('../data/questionsData');
            const { sectionsData } = require('../data/sectionsData');
            const { technologiesData } = require('../data/technologiesData');
            const { questionnairesData } = require('../data/questionnairesData');
            const { projectsData } = require('../data/projectsData');
            const { auditorsData } = require('../data/auditorsData');
            const { auditsData } = require('../data/auditsData');

            console.log('🔍 Checking localStorage for initialization...');
            console.log('🔍 Questions in storage:', this.loadQuestions().length);
            console.log('🔍 Sections in storage:', this.loadSections().length);
            console.log('🔍 Technologies in storage:', this.loadTechnologies().length);
            console.log('🔍 Questionnaires in storage:', this.loadQuestionnaires().length);
            console.log('🔍 Projects in storage:', this.loadProjects().length);
            console.log('🔍 Auditors in storage:', this.loadAuditors().length);
            console.log('🔍 Audits in storage:', this.loadAudits().length);

            // Only initialize if storage is empty
            if (this.loadQuestions().length === 0) {
                this.saveQuestions(questionsData);
                console.log('✅ Initialized questions with default data');
            }

            if (this.loadSections().length === 0) {
                this.saveSections(sectionsData);
                console.log('✅ Initialized sections with default data');
            }

            if (this.loadTechnologies().length === 0) {
                this.saveTechnologies(technologiesData);
                console.log('✅ Initialized technologies with default data');
            }

            if (this.loadQuestionnaires().length === 0) {
                this.saveQuestionnaires(questionnairesData);
                console.log('✅ Initialized questionnaires with default data');
            }

            if (this.loadProjects().length === 0) {
                this.saveProjects(projectsData);
                console.log('✅ Initialized projects with default data');
            }

            if (this.loadAuditors().length === 0) {
                this.saveAuditors(auditorsData);
                console.log('✅ Initialized auditors with default data');
            }

            if (this.loadAudits().length === 0) {
                this.saveAudits(auditsData);
                console.log('✅ Initialized audits with default data');
            }
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    }

    // Force initialize audit data (for testing)
    forceInitializeAudits() {
        try {
            const { auditsData } = require('../data/auditsData');
            this.saveAudits(auditsData);
            console.log('✅ Force initialized audits with sample data');
            return true;
        } catch (error) {
            console.error('❌ Error force initializing audits:', error);
            return false;
        }
    }

    // Clear all data (for testing/reset)
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🗑️ All data cleared from localStorage');
    }

    // Export all data (for backup)
    exportAllData() {
        const data = {};
        Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
            data[key] = this.loadData(storageKey);
        });
        return data;
    }

    // Import data (for restore)
    importData(data) {
        Object.entries(data).forEach(([key, value]) => {
            if (this.storageKeys[key]) {
                this.saveData(this.storageKeys[key], value);
            }
        });
        console.log('✅ Data imported successfully');
    }
}

// Create singleton instance
const dataPersistenceService = new DataPersistenceService();

// Initialize with defaults on first load
dataPersistenceService.initializeWithDefaults();

export default dataPersistenceService;
