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
            audits: 'techaudit_audits'
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

            console.log('🔍 Checking localStorage for initialization...');
            console.log('🔍 Questions in storage:', this.loadQuestions().length);
            console.log('🔍 Sections in storage:', this.loadSections().length);
            console.log('🔍 Technologies in storage:', this.loadTechnologies().length);
            console.log('🔍 Questionnaires in storage:', this.loadQuestionnaires().length);

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
        } catch (error) {
            console.error('❌ Error during initialization:', error);
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
