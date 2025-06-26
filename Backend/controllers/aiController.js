const aiService = require('../services/aiService');

/**
 * Get company recommendations based on industry
 * @route POST /api/ai/recommendations
 * @access Public
 */
const getCompanyRecommendations = async (req, res) => {
    try {
        const { industry, top_n = 6 } = req.body;

        // Validate input
        if (!industry || typeof industry !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Industry is required and must be a string'
            });
        }

        if (top_n && (typeof top_n !== 'number' || top_n < 1 || top_n > 20)) {
            return res.status(400).json({
                success: false,
                error: 'top_n must be a number between 1 and 20'
            });
        }

        // Get recommendations from AI service
        const result = await aiService.getCompanyRecommendations(industry, top_n);

        if (!result.success) {
            return res.status(503).json({
                success: false,
                error: 'AI service is currently unavailable',
                details: result.error
            });
        }

        res.json({
            success: true,
            message: `Found ${result.count} recommendations for ${industry}`,
            data: {
                industry: industry,
                recommendations: result.recommendations,
                count: result.count,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI Recommendations Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Predict startup success probability
 * @route POST /api/ai/predict-startup-success
 * @access Public
 */
const predictStartupSuccess = async (req, res) => {
    try {
        const startupData = req.body;

        // Validate startup data
        const validation = aiService.validateStartupData(startupData);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }

        // Get prediction from AI service
        const result = await aiService.predictStartupSuccess(startupData);

        if (!result.success) {
            return res.status(503).json({
                success: false,
                error: 'AI service is currently unavailable',
                details: result.error
            });
        }

        res.json({
            success: true,
            message: 'Startup success prediction completed',
            data: {
                prediction: result.prediction,
                interpretation: result.interpretation,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI Startup Success Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Predict profit based on spending allocation
 * @route POST /api/ai/predict-profit
 * @access Public
 */
const predictProfit = async (req, res) => {
    try {
        const spendingData = req.body;

        // Validate spending data
        const validation = aiService.validateSpendingData(spendingData);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }

        // Get prediction from AI service
        const result = await aiService.predictProfit(spendingData);

        if (!result.success) {
            return res.status(503).json({
                success: false,
                error: 'AI service is currently unavailable',
                details: result.error
            });
        }

        res.json({
            success: true,
            message: 'Profit prediction completed',
            data: {
                prediction: result.prediction,
                insights: result.insights,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI Profit Prediction Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Check AI service health
 * @route GET /api/ai/health
 * @access Public
 */
const checkAIHealth = async (req, res) => {
    try {
        const health = await aiService.checkHealth();

        if (!health.success) {
            return res.status(503).json({
                success: false,
                status: 'unhealthy',
                error: 'AI service is not responding',
                details: health.error
            });
        }

        res.json({
            success: true,
            status: 'healthy',
            data: {
                service: health.service,
                version: health.version,
                modelsLoaded: health.modelsLoaded,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI Health Check Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Get AI service information
 * @route GET /api/ai/info
 * @access Public
 */
const getAIInfo = async (req, res) => {
    try {
        const info = await aiService.getServiceInfo();

        if (!info.success) {
            return res.status(503).json({
                success: false,
                error: 'Unable to get AI service information',
                details: info.error
            });
        }

        res.json({
            success: true,
            data: {
                message: info.message,
                version: info.version,
                endpoints: info.endpoints,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI Info Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Get AI service status and capabilities
 * @route GET /api/ai/status
 * @access Public
 */
const getAIStatus = async (req, res) => {
    try {
        // Check both health and info
        const [health, info] = await Promise.allSettled([
            aiService.checkHealth(),
            aiService.getServiceInfo()
        ]);

        const status = {
            success: true,
            data: {
                service: 'StartFlow AI Integration',
                backend: {
                    status: 'healthy',
                    port: process.env.PORT || 3000,
                    environment: process.env.NODE_ENV || 'development'
                },
                ai_service: {
                    status: health.status === 'fulfilled' && health.value.success ? 'healthy' : 'unhealthy',
                    url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
                    health: health.status === 'fulfilled' ? health.value : { error: health.reason?.message },
                    info: info.status === 'fulfilled' ? info.value : { error: info.reason?.message }
                },
                features: {
                    recommendations: 'Company recommendations based on industry',
                    startup_success: 'Startup success probability prediction',
                    profit_prediction: 'Profit prediction based on spending allocation'
                },
                timestamp: new Date().toISOString()
            }
        };

        res.json(status);

    } catch (error) {
        console.error('AI Status Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    getCompanyRecommendations,
    predictStartupSuccess,
    predictProfit,
    checkAIHealth,
    getAIInfo,
    getAIStatus
}; 