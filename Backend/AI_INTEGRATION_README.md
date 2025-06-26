# StartFlow AI Integration Guide

This guide explains how the AI features are integrated with your StartFlow backend application.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   Frontend      │ ──────────────────► │   Backend       │
│   (Port 3000)   │                     │   (Port 3000)   │
└─────────────────┘                     └─────────────────┘
                                                │
                                                │ HTTP Requests
                                                ▼
                                       ┌─────────────────┐
                                       │   AI Service    │
                                       │   (Port 8000)   │
                                       └─────────────────┘
```

## 🚀 Quick Start

### 1. Start the AI Service
```bash
cd AI
python main.py
```
The AI service will start on `http://localhost:8000`

### 2. Start the Backend
```bash
cd Backend
npm start
```
The backend will start on `http://localhost:3000`

### 3. Test the Integration
```bash
cd Backend
node test_ai_integration.js
```

## 📁 Integration Files

### Backend Files Added/Modified:

1. **`services/aiService.js`** - AI service client
2. **`controllers/aiController.js`** - AI endpoint controllers
3. **`routes/aiRoutes.js`** - AI API routes
4. **`app.js`** - Updated to include AI routes
5. **`test_ai_integration.js`** - Integration test suite

## 🌐 API Endpoints

All AI endpoints are prefixed with `/api/ai/`:

### 1. Health & Status
- `GET /api/ai/health` - Check AI service health
- `GET /api/ai/info` - Get AI service information
- `GET /api/ai/status` - Get comprehensive status

### 2. AI Features
- `POST /api/ai/recommendations` - Get company recommendations
- `POST /api/ai/predict-startup-success` - Predict startup success
- `POST /api/ai/predict-profit` - Predict profit

## 📊 API Examples

### Get Company Recommendations
```bash
curl -X POST http://localhost:3000/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "Fintech",
    "top_n": 6
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Found 6 recommendations for Fintech",
  "data": {
    "industry": "Fintech",
    "recommendations": [
      {
        "Company Name": "Fawry",
        "Industry": "Digital Payments",
        "Funding Amount": "470 million",
        "Market Size": "Large"
      }
    ],
    "count": 6,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Predict Startup Success
```bash
curl -X POST http://localhost:3000/api/ai/predict-startup-success \
  -H "Content-Type: application/json" \
  -d '{
    "funding_total_usd": 1000000,
    "milestones": 5,
    "has_VC": 1,
    "has_angel": 1,
    "has_roundA": 1,
    "has_roundB": 0,
    "has_roundC": 0,
    "has_roundD": 0,
    "avg_participants": 3.5,
    "is_CA": 1,
    "is_NY": 0,
    "is_MA": 0,
    "is_TX": 0,
    "is_otherstate": 0,
    "age_first_funding_years": 2.5
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Startup success prediction completed",
  "data": {
    "prediction": {
      "success_prediction": 1,
      "success_probability": 0.85,
      "failure_probability": 0.15
    },
    "interpretation": {
      "success_likely": true,
      "confidence": 0.85,
      "risk_level": "Low"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Predict Profit
```bash
curl -X POST http://localhost:3000/api/ai/predict-profit \
  -H "Content-Type: application/json" \
  -d '{
    "RnD_Spend": 500000,
    "Administration": 200000,
    "Marketing_Spend": 300000
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Profit prediction completed",
  "data": {
    "prediction": {
      "predicted_profit": 750000,
      "confidence": 0.85,
      "currency": "USD"
    },
    "insights": {
      "total_spending": 1000000,
      "spending_breakdown": {
        "rnd_percentage": 50.0,
        "admin_percentage": 20.0,
        "marketing_percentage": 30.0
      },
      "recommendations": []
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file:

```env
# AI Service Configuration
AI_SERVICE_URL=http://localhost:8000

# Optional: Customize AI service timeout (default: 30 seconds)
AI_SERVICE_TIMEOUT=30000
```

### CORS Configuration

The backend is configured to allow requests from the AI service. If you need to modify CORS settings, update the configuration in `app.js`.

## 🧪 Testing

### Run Integration Tests
```bash
cd Backend
node test_ai_integration.js
```

### Test Individual Endpoints
```bash
# Test AI health
curl http://localhost:3000/api/ai/health

# Test AI status
curl http://localhost:3000/api/ai/status

# Test recommendations
curl -X POST http://localhost:3000/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"industry": "E-commerce"}'
```

## 📚 API Documentation

Once your backend is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **API Documentation**: The AI endpoints are fully documented in Swagger

## 🔍 Error Handling

The integration includes comprehensive error handling:

### AI Service Unavailable
```json
{
  "success": false,
  "error": "AI service is currently unavailable",
  "details": "Connection refused"
}
```

### Invalid Input
```json
{
  "success": false,
  "error": "Industry is required and must be a string"
}
```

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields: funding_total_usd, milestones, has_VC"
}
```

## 🚨 Troubleshooting

### Common Issues

1. **AI Service Not Responding**
   - Check if AI service is running: `cd AI && python main.py`
   - Verify port 8000 is not blocked
   - Check AI service logs for errors

2. **Backend Can't Connect to AI**
   - Verify `AI_SERVICE_URL` environment variable
   - Check firewall settings
   - Ensure both services are on the same network

3. **Model Loading Errors**
   - Check if AI models are properly trained
   - Verify model files exist in `AI/models/`
   - Check AI service logs for model loading errors

4. **CORS Issues**
   - Verify CORS configuration in `app.js`
   - Check if frontend is making requests from allowed origins

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=ai:*
```

## 🔄 Development Workflow

### 1. Start Both Services
```bash
# Terminal 1: Start AI Service
cd AI
python main.py

# Terminal 2: Start Backend
cd Backend
npm run dev
```

### 2. Test Changes
```bash
# Test AI features
cd Backend
node test_ai_integration.js

# Test specific endpoint
curl http://localhost:3000/api/ai/status
```

### 3. Monitor Logs
Both services provide detailed logging:
- Backend logs: Check terminal where backend is running
- AI service logs: Check terminal where AI service is running

## 📈 Performance Considerations

### Caching
Consider implementing caching for AI responses:
- Cache recommendations by industry
- Cache predictions for similar inputs
- Use Redis or in-memory caching

### Rate Limiting
The backend includes rate limiting:
- 100 requests per 15 minutes per IP
- Adjust in `app.js` if needed

### Timeouts
- AI service timeout: 30 seconds (configurable)
- Health check timeout: 5 seconds

## 🔮 Future Enhancements

1. **Model Versioning**: Implement model versioning and A/B testing
2. **Real-time Updates**: Add WebSocket support for real-time predictions
3. **Batch Processing**: Support batch prediction requests
4. **Model Monitoring**: Add model performance monitoring
5. **Caching Layer**: Implement intelligent caching for AI responses
6. **Authentication**: Add authentication for AI endpoints
7. **Analytics**: Track AI feature usage and performance

## 📞 Support

For issues with the AI integration:

1. **Check Logs**: Review both backend and AI service logs
2. **Run Tests**: Execute `node test_ai_integration.js`
3. **Verify Services**: Ensure both services are running
4. **Check Documentation**: Review API docs at `/api/docs`
5. **Environment**: Verify environment variables are set correctly

## 🎯 Integration Checklist

- [ ] AI service running on port 8000
- [ ] Backend running on port 3000
- [ ] Environment variables configured
- [ ] Integration tests passing
- [ ] API documentation accessible
- [ ] Error handling working
- [ ] CORS configured properly
- [ ] Rate limiting active
- [ ] Logging enabled
- [ ] Health checks responding

Your StartFlow AI integration is now ready! 🚀 