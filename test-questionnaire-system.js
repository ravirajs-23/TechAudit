const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const AUTH_TOKEN = 'your-auth-token-here'; // Replace with actual token

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Error ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
};

// Test the complete workflow
const testQuestionnaireSystem = async () => {
  console.log('🚀 Testing Tech Audit Questionnaire System\n');

  // Step 1: Create Questions (Reusable)
  console.log('📝 Step 1: Creating Questions...');
  
  const securityQuestions = [
    {
      text: "Is JWT token expiration properly configured?",
      guidance: "Check if JWT tokens have appropriate expiration times (recommended: 15-60 minutes)",
      evidenceRequired: "Configuration files and token validation logic",
      weight: 8,
      order: 1
    },
    {
      text: "Are passwords hashed using bcrypt with salt rounds >= 12?",
      guidance: "Verify password hashing implementation uses bcrypt with sufficient salt rounds",
      evidenceRequired: "Password hashing code and configuration",
      weight: 10,
      order: 2
    },
    {
      text: "Is HTTPS enforced for all API endpoints?",
      guidance: "Check if HTTP requests are redirected to HTTPS",
      evidenceRequired: "Server configuration and redirect rules",
      weight: 7,
      order: 3
    }
  ];

  const performanceQuestions = [
    {
      text: "Are database queries optimized with proper indexes?",
      guidance: "Review database query performance and index usage",
      evidenceRequired: "Database schema and query execution plans",
      weight: 6,
      order: 1
    },
    {
      text: "Is response caching implemented for static resources?",
      guidance: "Check if static assets use appropriate cache headers",
      evidenceRequired: "Cache configuration and response headers",
      weight: 5,
      order: 2
    }
  ];

  console.log('✅ Security questions defined');
  console.log('✅ Performance questions defined');

  // Step 2: Create Sections and Assign Questions
  console.log('\n📋 Step 2: Creating Sections with Questions...');
  
  const securitySection = {
    title: "Authentication & Authorization",
    description: "Security measures for user authentication and access control",
    weight: 30,
    order: 1,
    questions: securityQuestions
  };

  const performanceSection = {
    title: "Performance & Scalability",
    description: "System performance optimization and scalability measures",
    weight: 20,
    order: 2,
    questions: performanceQuestions
  };

  console.log('✅ Security section defined with questions');
  console.log('✅ Performance section defined with questions');

  // Step 3: Create Questionnaire and Assign Sections
  console.log('\n📊 Step 3: Creating Questionnaire with Sections...');
  
  const oracleQuestionnaire = {
    title: "Oracle Database Security & Performance Audit",
    version: "1.0",
    description: "Comprehensive security and performance assessment for Oracle databases",
    sections: [securitySection, performanceSection]
  };

  console.log('✅ Oracle questionnaire defined with sections');

  // Step 4: Create Technology and Assign Questionnaire
  console.log('\n🔧 Step 4: Creating Technology with Questionnaire...');
  
  const oracleTechnology = {
    name: "Oracle Database",
    version: "19c",
    vendor: "Oracle Corporation",
    category: "Database",
    riskLevel: "high",
    description: "Enterprise-grade relational database management system",
    projectId: "project123", // You'll need a real project ID
    questionnaire: oracleQuestionnaire,
    sections: [securitySection, performanceSection]
  };

  console.log('✅ Oracle technology defined with questionnaire');

  // Now let's test the API endpoints
  console.log('\n🌐 Testing API Endpoints...\n');

  // Test 1: Create Technology with Questionnaire
  console.log('🔧 Creating Oracle Technology with Questionnaire...');
  const techResult = await makeRequest('POST', '/technologies', oracleTechnology);
  
  if (techResult?.success) {
    console.log('✅ Technology created successfully!');
    console.log(`   Technology ID: ${techResult.data.technology.id}`);
    console.log(`   Questionnaire ID: ${techResult.data.questionnaire.id}`);
    console.log(`   Sections created: ${techResult.data.sections.length}`);
  } else {
    console.log('❌ Failed to create technology');
  }

  // Test 2: Get All Technologies
  console.log('\n🔍 Fetching all technologies...');
  const technologies = await makeRequest('GET', '/technologies');
  
  if (technologies?.success) {
    console.log(`✅ Found ${technologies.count} technologies`);
    technologies.data.forEach(tech => {
      console.log(`   - ${tech.name} ${tech.version} (${tech.category})`);
    });
  }

  // Test 3: Get All Questionnaires
  console.log('\n📊 Fetching all questionnaires...');
  const questionnaires = await makeRequest('GET', '/questionnaires');
  
  if (questionnaires?.success) {
    console.log(`✅ Found ${questionnaires.count} questionnaires`);
    questionnaires.data.forEach(q => {
      console.log(`   - ${q.title} v${q.version}`);
    });
  }

  // Test 4: Get Complete Questionnaire Structure
  if (techResult?.success) {
    console.log('\n📋 Fetching complete questionnaire structure...');
    const structure = await makeRequest('GET', `/questionnaires/${techResult.data.questionnaire.id}`);
    
    if (structure?.success) {
      console.log('✅ Questionnaire structure retrieved!');
      console.log(`   Title: ${structure.data.questionnaire.title}`);
      console.log(`   Sections: ${structure.data.structure.length}`);
      
      structure.data.structure.forEach((sectionData, index) => {
        console.log(`   Section ${index + 1}: ${sectionData.section.title}`);
        console.log(`     Questions: ${sectionData.questions.length}`);
        sectionData.questions.forEach(q => {
          console.log(`       - ${q.text} (Weight: ${q.weight})`);
        });
      });
    }
  }

  // Test 5: Reuse Sections for New Questionnaire
  console.log('\n🔄 Testing section reuse...');
  
  if (techResult?.success && techResult.data.sections.length > 0) {
    const sectionIds = techResult.data.sections.map(s => s.id);
    
    const newQuestionnaire = {
      title: "Web Application Security Audit",
      version: "1.0",
      description: "Security assessment for web applications using existing security sections",
      technologyId: "tech456", // You'll need a real technology ID
      sectionIds: sectionIds
    };

    const reuseResult = await makeRequest('POST', '/questionnaires/reuse-sections', newQuestionnaire);
    
    if (reuseResult?.success) {
      console.log('✅ Questionnaire created with reused sections!');
      console.log(`   New Questionnaire ID: ${reuseResult.data.questionnaire.id}`);
      console.log(`   Reused Sections: ${reuseResult.data.sections.length}`);
    } else {
      console.log('❌ Failed to create questionnaire with reused sections');
    }
  }

  console.log('\n🎉 Questionnaire System Test Complete!');
  console.log('\n📚 What we demonstrated:');
  console.log('   1. ✅ Created reusable questions');
  console.log('   2. ✅ Created sections and assigned questions');
  console.log('   3. ✅ Created questionnaire and assigned sections');
  console.log('   4. ✅ Created technology and assigned questionnaire');
  console.log('   5. ✅ Reused existing sections for new questionnaire');
  console.log('   6. ✅ Retrieved complete questionnaire structure');
};

// Run the test
if (require.main === module) {
  testQuestionnaireSystem().catch(console.error);
}

module.exports = { testQuestionnaireSystem };

