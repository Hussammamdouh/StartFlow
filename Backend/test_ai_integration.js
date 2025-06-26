const axios = require('axios');

// Test configuration
const BACKEND_URL = 'http://localhost:3000';
const AI_URL = 'http://localhost:8000';
const TIMEOUT = 10000;

class AIIntegrationTester {
    constructor() {
        this.backendUrl = BACKEND_URL;
        this.aiUrl = AI_URL;
        this.results = [];
    }

    async testEndpoint(endpoint, method = 'GET', data = null, description) {
        try {
            const url = `${this.backendUrl}${endpoint}`;
            const config = {
                method,
                url,
                timeout: TIMEOUT,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            
            this.results.push({
                endpoint,
                method,
                description,
                status: '✅ PASSED',
                statusCode: response.status,
                responseTime: response.headers['x-response-time'] || 'N/A'
            });

            return true;
        } catch (error) {
            this.results.push({
                endpoint,
                method,
                description,
                status: '❌ FAILED',
                statusCode: error.response?.status || 'N/A',
                error: error.response?.data?.error || error.message
            });

            return false;
        }
    }

    async testAIHealth() {
        console.log('🔍 Testing AI Service Health...');
        
        try {
            const response = await axios.get(`${this.aiUrl}/health`, { timeout: 5000 });
            
            if (response.status === 200 && response.data.status === 'healthy') {
                console.log('  ✅ AI Service is healthy');
                console.log(`    📊 Service: ${response.data.service}`);
                console.log(`    📊 Version: ${response.data.version}`);
                console.log(`    📊 Models Loaded: ${JSON.stringify(response.data.models_loaded)}`);
                return true;
            } else {
                console.log('  ❌ AI Service is unhealthy');
                return false;
            }
        } catch (error) {
            console.log('  ❌ AI Service is not responding');
            console.log(`    Error: ${error.message}`);
            return false;
        }
    }

    async runTests() {
        console.log('🚀 Starting StartFlow AI Integration Tests');
        console.log('=' * 60);
        
        // Test AI service health first
        const aiHealthy = await this.testAIHealth();
        console.log();

        if (!aiHealthy) {
            console.log('⚠️  AI Service is not available. Some tests may fail.');
            console.log('   Make sure to start the AI service: cd AI && python main.py');
            console.log();
        }

        // Test Backend AI Integration Endpoints
        console.log('🧪 Testing Backend AI Integration...');

        // Test AI status endpoint
        await this.testEndpoint(
            '/api/ai/status',
            'GET',
            null,
            'Get comprehensive AI service status'
        );

        // Test AI health endpoint
        await this.testEndpoint(
            '/api/ai/health',
            'GET',
            null,
            'Check AI service health through backend'
        );

        // Test AI info endpoint
        await this.testEndpoint(
            '/api/ai/info',
            'GET',
            null,
            'Get AI service information'
        );

        // Test recommendations endpoint
        await this.testEndpoint(
            '/api/ai/recommendations',
            'POST',
            {
                industry: 'Fintech',
                top_n: 3
            },
            'Get company recommendations for Fintech industry'
        );

        // Test startup success prediction
        await this.testEndpoint(
            '/api/ai/predict-startup-success',
            'POST',
            {
                funding_total_usd: 1000000,
                milestones: 5,
                has_VC: 1,
                has_angel: 1,
                has_roundA: 1,
                has_roundB: 0,
                has_roundC: 0,
                has_roundD: 0,
                avg_participants: 3.5,
                is_CA: 1,
                is_NY: 0,
                is_MA: 0,
                is_TX: 0,
                is_otherstate: 0,
                age_first_funding_years: 2.5
            },
            'Predict startup success probability'
        );

        // Test profit prediction
        await this.testEndpoint(
            '/api/ai/predict-profit',
            'POST',
            {
                RnD_Spend: 500000,
                Administration: 200000,
                Marketing_Spend: 300000
            },
            'Predict profit based on spending allocation'
        );

        // Test error handling - invalid input
        await this.testEndpoint(
            '/api/ai/recommendations',
            'POST',
            {
                industry: '', // Invalid empty industry
                top_n: 25 // Invalid top_n
            },
            'Test error handling with invalid input'
        );

        // Test error handling - missing required fields
        await this.testEndpoint(
            '/api/ai/predict-startup-success',
            'POST',
            {
                funding_total_usd: 1000000
                // Missing other required fields
            },
            'Test error handling with missing required fields'
        );

        console.log();
        this.printResults();
    }

    printResults() {
        console.log('=' * 60);
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('=' * 60);

        const passed = this.results.filter(r => r.status === '✅ PASSED').length;
        const failed = this.results.filter(r => r.status === '❌ FAILED').length;
        const total = this.results.length;

        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        console.log();

        // Print detailed results
        this.results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.method} ${result.endpoint}`);
            console.log(`   ${result.status} - ${result.description}`);
            console.log(`   Status Code: ${result.statusCode}`);
            
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
            
            console.log();
        });

        // Print summary
        if (failed === 0) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('✅ StartFlow AI integration is working correctly!');
        } else {
            console.log('⚠️  SOME TESTS FAILED');
            console.log('🔧 Please check the errors above and fix any issues.');
        }

        console.log();
        console.log('📋 Next Steps:');
        console.log('   1. If all tests passed, your AI integration is ready!');
        console.log('   2. If some tests failed, check the AI service is running');
        console.log('   3. Verify the AI service URL in your environment variables');
        console.log('   4. Check the API documentation at http://localhost:3000/api/docs');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new AIIntegrationTester();
    tester.runTests().catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = AIIntegrationTester; 