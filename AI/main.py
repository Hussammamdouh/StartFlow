from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

# Import our AI models
from models.recommendation_model import recommendation_model
from models.startup_success_model import startup_success_model
from models.profit_prediction_model import profit_prediction_model

# Initialize FastAPI app
app = FastAPI(
    title="StartFlow AI API",
    description="AI-powered features for startup ecosystem",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== RECOMMENDATION SYSTEM ====================

class IndustryInput(BaseModel):
    industry: str = Field(..., description="Industry to get recommendations for")
    top_n: Optional[int] = Field(6, description="Number of recommendations to return")

@app.post("/ai/recommendations", tags=["Recommendations"])
async def get_company_recommendations(input_data: IndustryInput):
    """
    Get company recommendations based on industry input using TF-IDF similarity
    """
    try:
        recommendations = recommendation_model.get_recommendations(
            input_data.industry, 
            input_data.top_n
        )
        return {
            "success": True,
            "industry": input_data.industry,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

# ==================== STARTUP SUCCESS PREDICTION ====================

class StartupSuccessInput(BaseModel):
    funding_total_usd: float = Field(..., description="Total funding in USD")
    milestones: int = Field(..., description="Number of milestones achieved")
    has_VC: int = Field(..., description="Has venture capital backing (0 or 1)")
    has_angel: int = Field(..., description="Has angel investor backing (0 or 1)")
    has_roundA: int = Field(..., description="Has completed Series A (0 or 1)")
    has_roundB: int = Field(..., description="Has completed Series B (0 or 1)")
    has_roundC: int = Field(..., description="Has completed Series C (0 or 1)")
    has_roundD: int = Field(..., description="Has completed Series D (0 or 1)")
    avg_participants: float = Field(..., description="Average number of participants in funding rounds")
    is_CA: int = Field(..., description="Is located in California (0 or 1)")
    is_NY: int = Field(..., description="Is located in New York (0 or 1)")
    is_MA: int = Field(..., description="Is located in Massachusetts (0 or 1)")
    is_TX: int = Field(..., description="Is located in Texas (0 or 1)")
    is_otherstate: int = Field(..., description="Is located in other states (0 or 1)")
    age_first_funding_years: float = Field(..., description="Age at first funding in years")

@app.post("/ai/predict-startup-success", tags=["Startup Success"])
async def predict_startup_success(input_data: StartupSuccessInput):
    """
    Predict startup success probability based on various factors
    """
    try:
        features = input_data.dict()
        prediction = startup_success_model.predict_success(features)
        
        return {
            "success": True,
            "prediction": prediction,
            "interpretation": {
                "success_likely": prediction['success_prediction'] == 1,
                "confidence": prediction['success_probability'],
                "risk_level": "Low" if prediction['success_probability'] > 0.7 else "Medium" if prediction['success_probability'] > 0.4 else "High"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting startup success: {str(e)}")

# ==================== PROFIT PREDICTION ====================

class ProfitPredictionInput(BaseModel):
    RnD_Spend: float = Field(..., description="Research and Development spending")
    Administration: float = Field(..., description="Administrative spending")
    Marketing_Spend: float = Field(..., description="Marketing spending")

@app.post("/ai/predict-profit", tags=["Profit Prediction"])
async def predict_profit(input_data: ProfitPredictionInput):
    """
    Predict profit based on spending allocation
    """
    try:
        features = input_data.dict()
        prediction = profit_prediction_model.predict_profit(features)
        insights = profit_prediction_model.get_spending_insights(features)
        
        return {
            "success": True,
            "prediction": prediction,
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting profit: {str(e)}")

# ==================== HEALTH CHECK ====================

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "StartFlow AI API",
        "version": "1.0.0",
        "models_loaded": {
            "recommendation": True,
            "startup_success": True,
            "profit_prediction": True
        }
    }

# ==================== ROOT ENDPOINT ====================

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information
    """
    return {
        "message": "Welcome to StartFlow AI API",
        "version": "1.0.0",
        "endpoints": {
            "recommendations": "/ai/recommendations",
            "startup_success": "/ai/predict-startup-success",
            "profit_prediction": "/ai/predict-profit",
            "health": "/health",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 