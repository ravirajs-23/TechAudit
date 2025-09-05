const AuditRepository = require('../../infrastructure/repositories/AuditRepository');

class CreateAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditData) {
        try {
            // Validate required fields
            if (!auditData.projectId) {
                throw new Error('Project ID is required');
            }
            if (!auditData.leadAuditorId) {
                throw new Error('Lead auditor ID is required');
            }

            // Create the audit
            const audit = await this.auditRepository.create(auditData);

            return {
                success: true,
                audit: audit,
                message: 'Audit created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class GetAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId) {
        try {
            const audit = await this.auditRepository.findById(auditId);

            if (!audit) {
                return {
                    success: false,
                    error: 'Audit not found'
                };
            }

            return {
                success: true,
                audit: audit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class GetAllAuditsUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute() {
        try {
            const audits = await this.auditRepository.findAll();

            return {
                success: true,
                audits: audits
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class UpdateAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId, updateData) {
        try {
            const audit = await this.auditRepository.update(auditId, updateData);

            if (!audit) {
                return {
                    success: false,
                    error: 'Audit not found'
                };
            }

            return {
                success: true,
                audit: audit,
                message: 'Audit updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class DeleteAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId) {
        try {
            const deleted = await this.auditRepository.delete(auditId);

            if (!deleted) {
                return {
                    success: false,
                    error: 'Audit not found'
                };
            }

            return {
                success: true,
                message: 'Audit deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class StartAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId) {
        try {
            const audit = await this.auditRepository.startAudit(auditId);

            return {
                success: true,
                audit: audit,
                message: 'Audit started successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class CompleteAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId) {
        try {
            const audit = await this.auditRepository.completeAudit(auditId);

            return {
                success: true,
                audit: audit,
                message: 'Audit completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class CancelAuditUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId) {
        try {
            const audit = await this.auditRepository.cancelAudit(auditId);

            return {
                success: true,
                audit: audit,
                message: 'Audit cancelled successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class UpdateAuditScoreUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(auditId, score) {
        try {
            if (score < 0 || score > 100) {
                return {
                    success: false,
                    error: 'Score must be between 0 and 100'
                };
            }

            const audit = await this.auditRepository.updateScore(auditId, score);

            return {
                success: true,
                audit: audit,
                message: 'Audit score updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class GetAuditsByStatusUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute(status) {
        try {
            const audits = await this.auditRepository.findByStatus(status);

            return {
                success: true,
                audits: audits
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class GetOverdueAuditsUseCase {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async execute() {
        try {
            const audits = await this.auditRepository.findOverdueAudits();

            return {
                success: true,
                audits: audits
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = {
    CreateAuditUseCase,
    GetAuditUseCase,
    GetAllAuditsUseCase,
    UpdateAuditUseCase,
    DeleteAuditUseCase,
    StartAuditUseCase,
    CompleteAuditUseCase,
    CancelAuditUseCase,
    UpdateAuditScoreUseCase,
    GetAuditsByStatusUseCase,
    GetOverdueAuditsUseCase
};
