const AuditModel = require('../database/models/AuditModel');
const Audit = require('../../domain/entities/Audit');

class AuditRepository {
    /**
     * Create a new audit
     * @param {Object} auditData
     * @returns {Promise<Audit>}
     */
    async create(auditData) {
        try {
            const audit = new Audit(
                null,
                auditData.projectId,
                auditData.leadAuditorId,
                auditData.teamMembers || [],
                auditData.status || 'planning',
                auditData.startDate || new Date(),
                auditData.completionDate || null,
                auditData.overallScore || 0,
                auditData.createdAt || new Date()
            );

            const validationErrors = audit.validate();
            if (validationErrors.length > 0) {
                throw new Error(`Audit validation failed: ${validationErrors.join(', ')}`);
            }

            const auditDoc = new AuditModel({
                projectId: audit.projectId,
                leadAuditorId: audit.leadAuditorId,
                teamMembers: audit.teamMembers,
                status: audit.status,
                startDate: audit.startDate,
                completionDate: audit.completionDate,
                overallScore: audit.overallScore
            });

            const savedAudit = await auditDoc.save();

            return new Audit(
                savedAudit._id.toString(),
                savedAudit.projectId.toString(),
                savedAudit.leadAuditorId.toString(),
                savedAudit.teamMembers.map(id => id.toString()),
                savedAudit.status,
                savedAudit.startDate,
                savedAudit.completionDate,
                savedAudit.overallScore,
                savedAudit.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to create audit: ${error.message}`);
        }
    }

    /**
     * Find audit by ID
     * @param {string} id
     * @returns {Promise<Audit|null>}
     */
    async findById(id) {
        try {
            const auditDoc = await AuditModel.findById(id)
                .populate('projectId', 'name client')
                .populate('leadAuditorId', 'firstName lastName email')
                .populate('teamMembers', 'firstName lastName email');

            if (!auditDoc) return null;

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId._id.toString(),
                auditDoc.leadAuditorId._id.toString(),
                auditDoc.teamMembers.map(member => member._id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to find audit: ${error.message}`);
        }
    }

    /**
     * Find audits by project
     * @param {string} projectId
     * @returns {Promise<Audit[]>}
     */
    async findByProject(projectId) {
        try {
            const auditDocs = await AuditModel.findByProject(projectId);

            return auditDocs.map(doc => new Audit(
                doc._id.toString(),
                doc.projectId._id.toString(),
                doc.leadAuditorId._id.toString(),
                doc.teamMembers.map(member => member._id.toString()),
                doc.status,
                doc.startDate,
                doc.completionDate,
                doc.overallScore,
                doc.createdAt
            ));
        } catch (error) {
            throw new Error(`Failed to find audits by project: ${error.message}`);
        }
    }

    /**
     * Find audits by lead auditor
     * @param {string} auditorId
     * @returns {Promise<Audit[]>}
     */
    async findByLeadAuditor(auditorId) {
        try {
            const auditDocs = await AuditModel.findByLeadAuditor(auditorId);

            return auditDocs.map(doc => new Audit(
                doc._id.toString(),
                doc.projectId._id.toString(),
                doc.leadAuditorId._id.toString(),
                doc.teamMembers.map(member => member._id.toString()),
                doc.status,
                doc.startDate,
                doc.completionDate,
                doc.overallScore,
                doc.createdAt
            ));
        } catch (error) {
            throw new Error(`Failed to find audits by lead auditor: ${error.message}`);
        }
    }

    /**
     * Find audits by status
     * @param {string} status
     * @returns {Promise<Audit[]>}
     */
    async findByStatus(status) {
        try {
            const auditDocs = await AuditModel.findByStatus(status);

            return auditDocs.map(doc => new Audit(
                doc._id.toString(),
                doc.projectId._id.toString(),
                doc.leadAuditorId._id.toString(),
                doc.teamMembers.map(member => member._id.toString()),
                doc.status,
                doc.startDate,
                doc.completionDate,
                doc.overallScore,
                doc.createdAt
            ));
        } catch (error) {
            throw new Error(`Failed to find audits by status: ${error.message}`);
        }
    }

    /**
     * Find overdue audits
     * @returns {Promise<Audit[]>}
     */
    async findOverdueAudits() {
        try {
            const auditDocs = await AuditModel.findOverdueAudits();

            return auditDocs.map(doc => new Audit(
                doc._id.toString(),
                doc.projectId._id.toString(),
                doc.leadAuditorId._id.toString(),
                doc.teamMembers.map(member => member._id.toString()),
                doc.status,
                doc.startDate,
                doc.completionDate,
                doc.overallScore,
                doc.createdAt
            ));
        } catch (error) {
            throw new Error(`Failed to find overdue audits: ${error.message}`);
        }
    }

    /**
     * Find all audits
     * @returns {Promise<Audit[]>}
     */
    async findAll() {
        try {
            const auditDocs = await AuditModel.find()
                .populate('projectId', 'name client')
                .populate('leadAuditorId', 'firstName lastName email')
                .populate('teamMembers', 'firstName lastName email')
                .sort({ createdAt: -1 });

            return auditDocs.map(doc => new Audit(
                doc._id.toString(),
                doc.projectId._id.toString(),
                doc.leadAuditorId._id.toString(),
                doc.teamMembers.map(member => member._id.toString()),
                doc.status,
                doc.startDate,
                doc.completionDate,
                doc.overallScore,
                doc.createdAt
            ));
        } catch (error) {
            throw new Error(`Failed to find audits: ${error.message}`);
        }
    }

    /**
     * Update an audit
     * @param {string} id
     * @param {Object} updateData
     * @returns {Promise<Audit|null>}
     */
    async update(id, updateData) {
        try {
            const auditDoc = await AuditModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('projectId', 'name client')
                .populate('leadAuditorId', 'firstName lastName email')
                .populate('teamMembers', 'firstName lastName email');

            if (!auditDoc) return null;

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId._id.toString(),
                auditDoc.leadAuditorId._id.toString(),
                auditDoc.teamMembers.map(member => member._id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to update audit: ${error.message}`);
        }
    }

    /**
     * Delete an audit
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        try {
            const result = await AuditModel.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Failed to delete audit: ${error.message}`);
        }
    }

    /**
     * Add team member to audit
     * @param {string} auditId
     * @param {string} userId
     * @returns {Promise<Audit>}
     */
    async addTeamMember(auditId, userId) {
        try {
            const auditDoc = await AuditModel.findById(auditId);
            if (!auditDoc) {
                throw new Error('Audit not found');
            }

            await auditDoc.addTeamMember(userId);

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId.toString(),
                auditDoc.leadAuditorId.toString(),
                auditDoc.teamMembers.map(id => id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to add team member: ${error.message}`);
        }
    }

    /**
     * Remove team member from audit
     * @param {string} auditId
     * @param {string} userId
     * @returns {Promise<Audit>}
     */
    async removeTeamMember(auditId, userId) {
        try {
            const auditDoc = await AuditModel.findById(auditId);
            if (!auditDoc) {
                throw new Error('Audit not found');
            }

            await auditDoc.removeTeamMember(userId);

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId.toString(),
                auditDoc.leadAuditorId.toString(),
                auditDoc.teamMembers.map(id => id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to remove team member: ${error.message}`);
        }
    }

    /**
     * Start an audit
     * @param {string} auditId
     * @returns {Promise<Audit>}
     */
    async startAudit(auditId) {
        try {
            const auditDoc = await AuditModel.findById(auditId);
            if (!auditDoc) {
                throw new Error('Audit not found');
            }

            await auditDoc.startAudit();

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId.toString(),
                auditDoc.leadAuditorId.toString(),
                auditDoc.teamMembers.map(id => id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to start audit: ${error.message}`);
        }
    }

    /**
     * Complete an audit
     * @param {string} auditId
     * @returns {Promise<Audit>}
     */
    async completeAudit(auditId) {
        try {
            const auditDoc = await AuditModel.findById(auditId);
            if (!auditDoc) {
                throw new Error('Audit not found');
            }

            await auditDoc.completeAudit();

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId.toString(),
                auditDoc.leadAuditorId.toString(),
                auditDoc.teamMembers.map(id => id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to complete audit: ${error.message}`);
        }
    }

    /**
     * Cancel an audit
     * @param {string} auditId
     * @returns {Promise<Audit>}
     */
    async cancelAudit(auditId) {
        try {
            const auditDoc = await AuditModel.findById(auditId);
            if (!auditDoc) {
                throw new Error('Audit not found');
            }

            await auditDoc.cancelAudit();

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId.toString(),
                auditDoc.leadAuditorId.toString(),
                auditDoc.teamMembers.map(id => id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to cancel audit: ${error.message}`);
        }
    }

    /**
     * Update audit score
     * @param {string} auditId
     * @param {number} score
     * @returns {Promise<Audit>}
     */
    async updateScore(auditId, score) {
        try {
            const auditDoc = await AuditModel.findById(auditId);
            if (!auditDoc) {
                throw new Error('Audit not found');
            }

            await auditDoc.updateScore(score);

            return new Audit(
                auditDoc._id.toString(),
                auditDoc.projectId.toString(),
                auditDoc.leadAuditorId.toString(),
                auditDoc.teamMembers.map(id => id.toString()),
                auditDoc.status,
                auditDoc.startDate,
                auditDoc.completionDate,
                auditDoc.overallScore,
                auditDoc.createdAt
            );
        } catch (error) {
            throw new Error(`Failed to update score: ${error.message}`);
        }
    }
}

module.exports = AuditRepository;
