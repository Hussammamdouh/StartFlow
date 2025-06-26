# StartFlow AI Integration

This directory contains the AI features for the StartFlow platform, providing intelligent recommendations and predictions for the startup ecosystem.

## 🚀 Features

### 1. Company Recommendations
- **Technology**: TF-IDF + Cosine Similarity
- **Purpose**: Recommend companies based on industry input
- **Input**: Industry name (e.g., "Fintech", "E-commerce")
- **Output**: List of similar companies with funding and market size info

### 2. Startup Success Prediction
- **Technology**: Random Forest Classifier
- **Purpose**: Predict startup success probability
- **Input**: Funding data, milestones, investor info, location
- **Output**: Success probability and risk assessment

### 3. Profit Prediction
- **Technology**: Linear Regression
- **Purpose**: Predict profit based on spending allocation
- **Input**: R&D, Administration, and Marketing spending
- **Output**: Predicted profit with spending insights

## 📁 Project Structure

```
AI/
├── main.py                          # Unified FastAPI application
├── requirements.txt                 # Python dependencies
├── test_ai_features.py             # Comprehensive test suite
├── README.md                       # This file
├── models/                         # AI Models directory
│   ├── __init__.py
│   ├── recommendation_model.py     # Company recommendation model
│   ├── startup_success_model.py    # Startup success prediction
│   └── profit_prediction_model.py  # Profit prediction model
└── models/                         # Trained model files (auto-generated)
    ├── startup_success_model.pkl
    ├── startup_success_scaler.pkl
    ├── profit_prediction_model.pkl
    └── profit_prediction_scaler.pkl
```

## 🛠️ Installation

1. **Install Python dependencies:**
   ```bash
   cd AI
   pip install -r requirements.txt
   ```

2. **Run the AI server:**
   ```bash
   python main.py
   ```

3. **Test the AI features:**
   ```bash
   python test_ai_features.py
   ```

## 🌐 API Endpoints

### Base URL: `http://localhost:8000`

### 1. Health Check
```http
GET /health
```

### 2. Company Recommendations
```http
POST /ai/recommendations
Content-Type: application/json

{
  "industry": "Fintech",
  "top_n": 6
}
```

### 3. Startup Success Prediction
```http
POST /ai/predict-startup-success
Content-Type: application/json

{
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
}
```

### 4. Profit Prediction
```http
POST /ai/predict-profit
Content-Type: application/json

{
  "RnD_Spend": 500000,
  "Administration": 200000,
  "Marketing_Spend": 300000
}
```

## 📊 API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## 🧪 Testing

### Run All Tests
```bash
python test_ai_features.py
```

### Test Individual Models
```python
from models.recommendation_model import recommendation_model
from models.startup_success_model import startup_success_model
from models.profit_prediction_model import profit_prediction_model

# Test recommendations
recs = recommendation_model.get_recommendations("Fintech", top_n=3)

# Test startup success
prediction = startup_success_model.predict_success({
    "funding_total_usd": 1000000,
    "milestones": 5,
    # ... other features
})

# Test profit prediction
profit = profit_prediction_model.predict_profit({
    "RnD_Spend": 500000,
    "Administration": 200000,
    "Marketing_Spend": 300000
})
```

## 🔧 Integration with Backend

### Node.js/Express Integration Example
```javascript
const axios = require('axios');

// Get company recommendations
async function getRecommendations(industry) {
  try {
    const response = await axios.post('http://localhost:8000/ai/recommendations', {
      industry: industry,
      top_n: 6
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

// Predict startup success
async function predictStartupSuccess(startupData) {
  try {
    const response = await axios.post('http://localhost:8000/ai/predict-startup-success', startupData);
    return response.data;
  } catch (error) {
    console.error('Error predicting startup success:', error);
    throw error;
  }
}

// Predict profit
async function predictProfit(spendingData) {
  try {
    const response = await axios.post('http://localhost:8000/ai/predict-profit', spendingData);
    return response.data;
  } catch (error) {
    console.error('Error predicting profit:', error);
    throw error;
  }
}
```

## 📈 Model Performance

### Recommendation Model
- **Algorithm**: TF-IDF + Cosine Similarity
- **Data**: 50+ Egyptian companies across various industries
- **Features**: Industry, company name, funding amount, market size

### Startup Success Model
- **Algorithm**: Random Forest Classifier
- **Accuracy**: ~85% (training), ~82% (testing)
- **Features**: 15 features including funding, milestones, investors, location

### Profit Prediction Model
- **Algorithm**: Linear Regression
- **R² Score**: ~0.85 (training), ~0.83 (testing)
- **Features**: R&D, Administration, Marketing spending

## 🔄 Model Training

Models are automatically trained when first initialized. Training data is generated synthetically based on realistic business patterns. In production, you should:

1. Replace synthetic data with real historical data
2. Retrain models periodically with new data
3. Implement model versioning and A/B testing
4. Add model monitoring and performance tracking

## 🚨 Important Notes

1. **Model Files**: `.pkl` files are auto-generated in the `models/` directory
2. **CORS**: Currently allows all origins - configure properly for production
3. **Error Handling**: All endpoints include comprehensive error handling
4. **Validation**: Input validation using Pydantic models
5. **Logging**: Add proper logging for production deployment

## 🔮 Future Enhancements

1. **Real Data Integration**: Replace synthetic data with real startup data
2. **Model Improvements**: Experiment with more advanced algorithms
3. **Feature Engineering**: Add more relevant features
4. **Model Monitoring**: Implement model drift detection
5. **A/B Testing**: Add capability to test different model versions
6. **Caching**: Implement response caching for better performance
7. **Rate Limiting**: Add API rate limiting for production use

## 📞 Support

For issues or questions about the AI integration:
1. Check the test results: `python test_ai_features.py`
2. Review the API documentation: http://localhost:8000/docs
3. Check the logs for error messages
4. Ensure all dependencies are installed correctly 