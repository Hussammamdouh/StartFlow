const axios = require('axios');

class AIService {
    constructor() {
        this.aiBaseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        this.timeout = 30000; // 30 seconds timeout
    }

    /**
     * Get company recommendations based on industry
     * @param {string} industry - The industry to get recommendations for
     * @param {number} topN - Number of recommendations to return (default: 6)
     * @returns {Promise<Object>} Recommendations data
     */
    async getCompanyRecommendations(industry, topN = 6) {
        try {
            const response = await axios.post(`${this.aiBaseUrl}/ai/recommendations`, {
                industry: industry,
                top_n: topN
            }, {
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data,
                recommendations: response.data.recommendations,
                count: response.data.count
            };
        } catch (error) {
            console.error('AI Recommendation Error:', error.message);
            return {
                success: false,
                error: error.response?.data?.detail || error.message,
                recommendations: [],
                count: 0
            };
        }
    }

    /**
     * Predict startup success probability
     * @param {Object} startupData - Startup data for prediction
     * @returns {Promise<Object>} Prediction results
     */
    async predictStartupSuccess(startupData) {
        try {
            const response = await axios.post(`${this.aiBaseUrl}/ai/predict-startup-success`, startupData, {
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data,
                prediction: response.data.prediction,
                interpretation: response.data.interpretation
            };
        } catch (error) {
            console.error('AI Startup Success Prediction Error:', error.message);
            return {
                success: false,
                error: error.response?.data?.detail || error.message,
                prediction: null,
                interpretation: null
            };
        }
    }

    /**
     * Predict profit based on spending allocation
     * @param {Object} spendingData - Spending data for prediction
     * @returns {Promise<Object>} Prediction results with insights
     */
    async predictProfit(spendingData) {
        try {
            const response = await axios.post(`${this.aiBaseUrl}/ai/predict-profit`, spendingData, {
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data,
                prediction: response.data.prediction,
                insights: response.data.insights
            };
        } catch (error) {
            console.error('AI Profit Prediction Error:', error.message);
            return {
                success: false,
                error: error.response?.data?.detail || error.message,
                prediction: null,
                insights: null
            };
        }
    }

    /**
     * Check AI service health
     * @returns {Promise<Object>} Health status
     */
    async checkHealth() {
        try {
            const response = await axios.get(`${this.aiBaseUrl}/health`, {
                timeout: 5000
            });

            return {
                success: true,
                status: response.data.status,
                service: response.data.service,
                version: response.data.version,
                modelsLoaded: response.data.models_loaded
            };
        } catch (error) {
            console.error('AI Health Check Error:', error.message);
            return {
                success: false,
                error: error.message,
                status: 'unhealthy'
            };
        }
    }

    /**
     * Get AI service information
     * @returns {Promise<Object>} Service information
     */
    async getServiceInfo() {
        try {
            const response = await axios.get(`${this.aiBaseUrl}/`, {
                timeout: 5000
            });

            return {
                success: true,
                message: response.data.message,
                version: response.data.version,
                endpoints: response.data.endpoints
            };
        } catch (error) {
            console.error('AI Service Info Error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validate startup data for prediction
     * @param {Object} data - Startup data to validate
     * @returns {Object} Validation result
     */
    validateStartupData(data) {
        const requiredFields = [
            'funding_total_usd', 'milestones', 'has_VC', 'has_angel',
            'has_roundA', 'has_roundB', 'has_roundC', 'has_roundD',
            'avg_participants', 'is_CA', 'is_NY', 'is_MA', 'is_TX',
            'is_otherstate', 'age_first_funding_years'
        ];

        const missingFields = requiredFields.filter(field => !(field in data));
        
        if (missingFields.length > 0) {
            return {
                valid: false,
                missingFields: missingFields,
                error: `Missing required fields: ${missingFields.join(', ')}`
            };
        }

        // Validate data types and ranges
        const validations = [
            { field: 'funding_total_usd', type: 'number', min: 0 },
            { field: 'milestones', type: 'number', min: 0 },
            { field: 'has_VC', type: 'number', values: [0, 1] },
            { field: 'has_angel', type: 'number', values: [0, 1] },
            { field: 'has_roundA', type: 'number', values: [0, 1] },
            { field: 'has_roundB', type: 'number', values: [0, 1] },
            { field: 'has_roundC', type: 'number', values: [0, 1] },
            { field: 'has_roundD', type: 'number', values: [0, 1] },
            { field: 'avg_participants', type: 'number', min: 0 },
            { field: 'is_CA', type: 'number', values: [0, 1] },
            { field: 'is_NY', type: 'number', values: [0, 1] },
            { field: 'is_MA', type: 'number', values: [0, 1] },
            { field: 'is_TX', type: 'number', values: [0, 1] },
            { field: 'is_otherstate', type: 'number', values: [0, 1] },
            { field: 'age_first_funding_years', type: 'number', min: 0 }
        ];

        for (const validation of validations) {
            const value = data[validation.field];
            
            if (typeof value !== validation.type) {
                return {
                    valid: false,
                    error: `${validation.field} must be a ${validation.type}`
                };
            }

            if (validation.min !== undefined && value < validation.min) {
                return {
                    valid: false,
                    error: `${validation.field} must be greater than or equal to ${validation.min}`
                };
            }

            if (validation.values && !validation.values.includes(value)) {
                return {
                    valid: false,
                    error: `${validation.field} must be one of: ${validation.values.join(', ')}`
                };
            }
        }

        return { valid: true };
    }

    /**
     * Validate spending data for profit prediction
     * @param {Object} data - Spending data to validate
     * @returns {Object} Validation result
     */
    validateSpendingData(data) {
        const requiredFields = ['RnD_Spend', 'Administration', 'Marketing_Spend'];
        const missingFields = requiredFields.filter(field => !(field in data));
        
        if (missingFields.length > 0) {
            return {
                valid: false,
                missingFields: missingFields,
                error: `Missing required fields: ${missingFields.join(', ')}`
            };
        }

        // Validate data types and ranges
        for (const field of requiredFields) {
            const value = data[field];
            
            if (typeof value !== 'number') {
                return {
                    valid: false,
                    error: `${field} must be a number`
                };
            }

            if (value < 0) {
                return {
                    valid: false,
                    error: `${field} must be greater than or equal to 0`
                };
            }
        }

        return { valid: true };
    }
}

module.exports = new AIService(); 