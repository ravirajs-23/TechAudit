const QuestionRepository = require('../repositories/QuestionRepository');
const QuestionService = require('./QuestionService');
const AuthService = require('./AuthService');

/**
 * Service Factory - Dependency Injection के लिए
 * सभी services को properly configured instance के साथ provide करता है
 */
class ServiceFactory {
    constructor() {
        this.services = new Map();
        this.repositories = new Map();
        this.initializeRepositories();
        this.initializeServices();
    }

    /**
     * सभी repositories को initialize करना
     */
    initializeRepositories() {
        // Question Repository
        this.repositories.set('questionRepository', new QuestionRepository());
    }

    /**
     * सभी services को initialize करना
     */
    initializeServices() {
        // Question Service
        const questionRepository = this.repositories.get('questionRepository');
        this.services.set('questionService', new QuestionService(questionRepository));

        // Auth Service
        this.services.set('authService', new AuthService());
    }

    /**
     * Service instance get करना
     * @param {string} serviceName - Service name
     * @returns {Object} - Service instance
     */
    getService(serviceName) {
        if (!this.services.has(serviceName)) {
            throw new Error(`Service '${serviceName}' not found`);
        }
        return this.services.get(serviceName);
    }

    /**
     * Repository instance get करना
     * @param {string} repositoryName - Repository name
     * @returns {Object} - Repository instance
     */
    getRepository(repositoryName) {
        if (!this.repositories.has(repositoryName)) {
            throw new Error(`Repository '${repositoryName}' not found`);
        }
        return this.repositories.get(repositoryName);
    }

    /**
     * सभी available services की list
     * @returns {string[]} - Service names
     */
    getAvailableServices() {
        return Array.from(this.services.keys());
    }

    /**
     * सभी available repositories की list
     * @returns {string[]} - Repository names
     */
    getAvailableRepositories() {
        return Array.from(this.repositories.keys());
    }
}

// Singleton instance
const serviceFactory = new ServiceFactory();

module.exports = serviceFactory;
