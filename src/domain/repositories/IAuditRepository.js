class IAuditRepository {
    async create(audit) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findByProject(projectId) {
        throw new Error('Method not implemented');
    }

    async findByLeadAuditor(auditorId) {
        throw new Error('Method not implemented');
    }

    async findByStatus(status) {
        throw new Error('Method not implemented');
    }

    async findOverdueAudits() {
        throw new Error('Method not implemented');
    }

    async update(id, auditData) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async findAll() {
        throw new Error('Method not implemented');
    }

    async addTeamMember(auditId, userId) {
        throw new Error('Method not implemented');
    }

    async removeTeamMember(auditId, userId) {
        throw new Error('Method not implemented');
    }

    async startAudit(auditId) {
        throw new Error('Method not implemented');
    }

    async completeAudit(auditId) {
        throw new Error('Method not implemented');
    }

    async cancelAudit(auditId) {
        throw new Error('Method not implemented');
    }

    async updateScore(auditId, score) {
        throw new Error('Method not implemented');
    }
}

module.exports = IAuditRepository;
