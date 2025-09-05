const mongoose = require('mongoose');
const AuditRepository = require('../src/infrastructure/repositories/AuditRepository');
const { CreateAuditUseCase, GetAllAuditsUseCase } = require('../src/application/useCases/audit');

// Test configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tecaudit';

async function testAuditPersistence() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const auditRepository = new AuditRepository();
        const createAuditUseCase = new CreateAuditUseCase(auditRepository);
        const getAllAuditsUseCase = new GetAllAuditsUseCase(auditRepository);

        console.log('\n📝 Testing Audit Creation...');

        // Test data
        const testAuditData = {
            projectId: '507f1f77bcf86cd799439011', // Sample ObjectId
            leadAuditorId: '507f1f77bcf86cd799439012', // Sample ObjectId
            status: 'planning',
            startDate: new Date(),
            overallScore: 0
        };

        // Create audit
        const createResult = await createAuditUseCase.execute(testAuditData);

        if (createResult.success) {
            console.log('✅ Audit created successfully:', createResult.audit.id);

            // Test retrieving all audits
            console.log('\n📋 Testing Audit Retrieval...');
            const getAllResult = await getAllAuditsUseCase.execute();

            if (getAllResult.success) {
                console.log(`✅ Retrieved ${getAllResult.audits.length} audits`);
                console.log('📊 Audits:', getAllResult.audits.map(audit => ({
                    id: audit.id,
                    projectId: audit.projectId,
                    status: audit.status,
                    overallScore: audit.overallScore
                })));
            } else {
                console.log('❌ Failed to retrieve audits:', getAllResult.error);
            }
        } else {
            console.log('❌ Failed to create audit:', createResult.error);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run the test
if (require.main === module) {
    testAuditPersistence();
}

module.exports = { testAuditPersistence };
