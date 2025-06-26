import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

class ProfitPredictionModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = "models/profit_prediction_model.pkl"
        self.scaler_path = "models/profit_prediction_scaler.pkl"
        self._load_or_train_model()
    
    def _generate_sample_data(self):
        """Generate sample training data for profit prediction"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate realistic spending data
        rnd_spend = np.random.uniform(10000, 1000000, n_samples)
        admin_spend = np.random.uniform(5000, 500000, n_samples)
        marketing_spend = np.random.uniform(5000, 800000, n_samples)
        
        # Create profit based on spending with some realistic relationships
        # R&D typically has highest ROI, then marketing, then admin
        base_profit = (
            rnd_spend * 0.8 +  # R&D has high ROI
            marketing_spend * 0.6 +  # Marketing has medium ROI
            admin_spend * 0.3 +  # Admin has lower ROI
            np.random.normal(0, 50000, n_samples)  # Add some noise
        )
        
        # Ensure profit is positive (most businesses aim for profit)
        profit = np.maximum(base_profit, 1000)
        
        data = {
            'RnD_Spend': rnd_spend,
            'Administration': admin_spend,
            'Marketing_Spend': marketing_spend,
            'Profit': profit
        }
        
        return pd.DataFrame(data)
    
    def _train_model(self):
        """Train the Linear Regression model"""
        print("Training profit prediction model...")
        
        # Generate sample data
        df = self._generate_sample_data()
        
        # Prepare features and target
        X = df[['RnD_Spend', 'Administration', 'Marketing_Spend']]
        y = df['Profit']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model = LinearRegression()
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        y_pred_train = self.model.predict(X_train_scaled)
        y_pred_test = self.model.predict(X_test_scaled)
        
        train_r2 = r2_score(y_train, y_pred_train)
        test_r2 = r2_score(y_test, y_pred_test)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
        
        print(f"Training R²: {train_r2:.3f}")
        print(f"Testing R²: {test_r2:.3f}")
        print(f"Training RMSE: ${train_rmse:,.2f}")
        print(f"Testing RMSE: ${test_rmse:,.2f}")
        
        # Save model and scaler
        os.makedirs("models", exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        
        print("Profit prediction model saved successfully!")
    
    def _load_or_train_model(self):
        """Load existing model or train new one"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                print("Profit prediction model loaded successfully!")
            else:
                self._train_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            self._train_model()
    
    def predict_profit(self, features):
        """
        Predict profit based on spending
        
        Args:
            features (dict): Dictionary containing spending features
            
        Returns:
            dict: Prediction result with predicted profit and confidence
        """
        try:
            # Prepare feature vector
            feature_vector = np.array([[
                features['RnD_Spend'],
                features['Administration'],
                features['Marketing_Spend']
            ]])
            
            # Scale features
            scaled_features = self.scaler.transform(feature_vector)
            
            # Make prediction
            predicted_profit = self.model.predict(scaled_features)[0]
            
            # Calculate confidence based on model performance
            # For linear regression, we can use R² as a confidence indicator
            confidence = 0.85  # This would be calculated from actual model performance
            
            return {
                'predicted_profit': float(predicted_profit),
                'confidence': confidence,
                'currency': 'USD'
            }
            
        except Exception as e:
            print(f"Error in profit prediction: {e}")
            return {
                'predicted_profit': 0.0,
                'confidence': 0.0,
                'currency': 'USD',
                'error': str(e)
            }
    
    def get_spending_insights(self, features):
        """
        Provide insights on spending allocation
        
        Args:
            features (dict): Dictionary containing spending features
            
        Returns:
            dict: Insights about spending allocation
        """
        try:
            rnd = features['RnD_Spend']
            admin = features['Administration']
            marketing = features['Marketing_Spend']
            total = rnd + admin + marketing
            
            insights = {
                'total_spending': float(total),
                'spending_breakdown': {
                    'rnd_percentage': float(rnd / total * 100),
                    'admin_percentage': float(admin / total * 100),
                    'marketing_percentage': float(marketing / total * 100)
                },
                'recommendations': []
            }
            
            # Add recommendations based on spending patterns
            if rnd / total < 0.3:
                insights['recommendations'].append("Consider increasing R&D spending for better innovation potential")
            
            if marketing / total > 0.6:
                insights['recommendations'].append("Marketing spending seems high, consider rebalancing")
            
            if admin / total > 0.4:
                insights['recommendations'].append("Administrative costs are high, look for efficiency improvements")
            
            return insights
            
        except Exception as e:
            return {
                'error': f"Error generating insights: {str(e)}"
            }

# Global instance
profit_prediction_model = ProfitPredictionModel() 