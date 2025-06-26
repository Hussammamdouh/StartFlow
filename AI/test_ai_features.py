#!/usr/bin/env python3
"""
Test script for StartFlow AI Features
This script tests all AI models and endpoints to ensure they work correctly
"""

import requests
import json
import time
from models.recommendation_model import recommendation_model
from models.startup_success_model import startup_success_model
from models.profit_prediction_model import profit_prediction_model

# Test configuration
API_BASE_URL = "http://localhost:8000"
TEST_TIMEOUT = 30

def test_recommendation_model():
    """Test the recommendation model directly"""
    print("🧪 Testing Recommendation Model...")
    
    try:
        # Test with different industries
        test_industries = ["Fintech", "E-commerce", "Healthcare", "Transport"]
        
        for industry in test_industries:
            recommendations = recommendation_model.get_recommendations(industry, top_n=3)
            
            print(f"  ✅ {industry}: Found {len(recommendations)} recommendations")
            
            # Verify structure
            if recommendations and len(recommendations) > 0:
                first_rec = recommendations[0]
                required_fields = ['Company Name', 'Industry', 'Funding Amount', 'Market Size']
                
                if all(field in first_rec for field in required_fields):
                    print(f"    📋 Structure valid for {industry}")
                else:
                    print(f"    ❌ Invalid structure for {industry}")
                    return False
            else:
                print(f"    ❌ No recommendations for {industry}")
                return False
        
        print("  ✅ Recommendation model test passed!")
        return True
        
    except Exception as e:
        print(f"  ❌ Recommendation model test failed: {e}")
        return False

def test_startup_success_model():
    """Test the startup success prediction model directly"""
    print("🧪 Testing Startup Success Model...")
    
    try:
        # Test with sample data
        test_features = {
            'funding_total_usd': 1000000,
            'milestones': 5,
            'has_VC': 1,
            'has_angel': 1,
            'has_roundA': 1,
            'has_roundB': 0,
            'has_roundC': 0,
            'has_roundD': 0,
            'avg_participants': 3.5,
            'is_CA': 1,
            'is_NY': 0,
            'is_MA': 0,
            'is_TX': 0,
            'is_otherstate': 0,
            'age_first_funding_years': 2.5
        }
        
        prediction = startup_success_model.predict_success(test_features)
        
        # Verify prediction structure
        required_fields = ['success_prediction', 'success_probability', 'failure_probability']
        if all(field in prediction for field in required_fields):
            print(f"  ✅ Prediction structure valid")
            print(f"    📊 Success prediction: {prediction['success_prediction']}")
            print(f"    📊 Success probability: {prediction['success_probability']:.3f}")
            print(f"    📊 Failure probability: {prediction['failure_probability']:.3f}")
        else:
            print(f"  ❌ Invalid prediction structure")
            return False
        
        print("  ✅ Startup success model test passed!")
        return True
        
    except Exception as e:
        print(f"  ❌ Startup success model test failed: {e}")
        return False

def test_profit_prediction_model():
    """Test the profit prediction model directly"""
    print("🧪 Testing Profit Prediction Model...")
    
    try:
        # Test with sample data
        test_features = {
            'RnD_Spend': 500000,
            'Administration': 200000,
            'Marketing_Spend': 300000
        }
        
        prediction = profit_prediction_model.predict_profit(test_features)
        insights = profit_prediction_model.get_spending_insights(test_features)
        
        # Verify prediction structure
        if 'predicted_profit' in prediction and 'confidence' in prediction:
            print(f"  ✅ Prediction structure valid")
            print(f"    📊 Predicted profit: ${prediction['predicted_profit']:,.2f}")
            print(f"    📊 Confidence: {prediction['confidence']:.3f}")
        else:
            print(f"  ❌ Invalid prediction structure")
            return False
        
        # Verify insights structure
        if 'total_spending' in insights and 'spending_breakdown' in insights:
            print(f"  ✅ Insights structure valid")
            print(f"    📊 Total spending: ${insights['total_spending']:,.2f}")
            print(f"    📊 R&D: {insights['spending_breakdown']['rnd_percentage']:.1f}%")
            print(f"    📊 Admin: {insights['spending_breakdown']['admin_percentage']:.1f}%")
            print(f"    📊 Marketing: {insights['spending_breakdown']['marketing_percentage']:.1f}%")
        else:
            print(f"  ❌ Invalid insights structure")
            return False
        
        print("  ✅ Profit prediction model test passed!")
        return True
        
    except Exception as e:
        print(f"  ❌ Profit prediction model test failed: {e}")
        return False

def test_api_endpoints():
    """Test the FastAPI endpoints"""
    print("🧪 Testing API Endpoints...")
    
    try:
        # Test health endpoint
        print("  🔍 Testing health endpoint...")
        response = requests.get(f"{API_BASE_URL}/health", timeout=TEST_TIMEOUT)
        
        if response.status_code == 200:
            health_data = response.json()
            print(f"    ✅ Health check passed: {health_data['status']}")
        else:
            print(f"    ❌ Health check failed: {response.status_code}")
            return False
        
        # Test recommendations endpoint
        print("  🔍 Testing recommendations endpoint...")
        rec_data = {"industry": "Fintech", "top_n": 3}
        response = requests.post(f"{API_BASE_URL}/ai/recommendations", 
                               json=rec_data, timeout=TEST_TIMEOUT)
        
        if response.status_code == 200:
            rec_result = response.json()
            print(f"    ✅ Recommendations: {rec_result['count']} companies found")
        else:
            print(f"    ❌ Recommendations failed: {response.status_code}")
            return False
        
        # Test startup success endpoint
        print("  🔍 Testing startup success endpoint...")
        startup_data = {
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
        response = requests.post(f"{API_BASE_URL}/ai/predict-startup-success", 
                               json=startup_data, timeout=TEST_TIMEOUT)
        
        if response.status_code == 200:
            startup_result = response.json()
            print(f"    ✅ Startup success prediction: {startup_result['prediction']['success_prediction']}")
        else:
            print(f"    ❌ Startup success failed: {response.status_code}")
            return False
        
        # Test profit prediction endpoint
        print("  🔍 Testing profit prediction endpoint...")
        profit_data = {
            "RnD_Spend": 500000,
            "Administration": 200000,
            "Marketing_Spend": 300000
        }
        response = requests.post(f"{API_BASE_URL}/ai/predict-profit", 
                               json=profit_data, timeout=TEST_TIMEOUT)
        
        if response.status_code == 200:
            profit_result = response.json()
            print(f"    ✅ Profit prediction: ${profit_result['prediction']['predicted_profit']:,.2f}")
        else:
            print(f"    ❌ Profit prediction failed: {response.status_code}")
            return False
        
        print("  ✅ All API endpoints test passed!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("  ❌ Could not connect to API. Make sure the server is running on localhost:8000")
        return False
    except Exception as e:
        print(f"  ❌ API test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting StartFlow AI Features Test Suite")
    print("=" * 50)
    
    # Test models directly
    model_tests = [
        test_recommendation_model,
        test_startup_success_model,
        test_profit_prediction_model
    ]
    
    model_results = []
    for test in model_tests:
        result = test()
        model_results.append(result)
        print()
    
    # Test API endpoints
    print("🌐 Testing API Integration...")
    api_result = test_api_endpoints()
    print()
    
    # Summary
    print("=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    all_passed = all(model_results) and api_result
    
    if all_passed:
        print("✅ ALL TESTS PASSED!")
        print("🎉 StartFlow AI features are working correctly!")
        print("\n📋 Next steps:")
        print("   1. The AI models are ready for integration")
        print("   2. API endpoints are functional")
        print("   3. You can now integrate with your backend")
    else:
        print("❌ SOME TESTS FAILED!")
        print("\n🔧 Issues to fix:")
        if not all(model_results):
            print("   - Some AI models have issues")
        if not api_result:
            print("   - API endpoints are not working")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 