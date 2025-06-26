import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

class StartupSuccessModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = "models/startup_success_model.pkl"
        self.scaler_path = "models/startup_success_scaler.pkl"
        self._load_or_train_model()
    
    def _generate_sample_data(self):
        """Generate sample training data for startup success prediction"""
        np.random.seed(42)
        n_samples = 1000
        
        data = {
            'funding_total_usd': np.random.uniform(10000, 10000000, n_samples),
            'milestones': np.random.randint(0, 20, n_samples),
            'has_VC': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'has_angel': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'has_roundA': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'has_roundB': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'has_roundC': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'has_roundD': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'avg_participants': np.random.uniform(1, 10, n_samples),
            'is_CA': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'is_NY': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'is_MA': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'is_TX': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'is_otherstate': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'age_first_funding_years': np.random.uniform(0, 10, n_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Create target variable based on features
        # Higher funding, more milestones, VC backing, and older age increase success probability
        success_prob = (
            df['funding_total_usd'] / 1000000 * 0.1 +
            df['milestones'] * 0.05 +
            df['has_VC'] * 0.3 +
            df['has_angel'] * 0.2 +
            df['has_roundA'] * 0.15 +
            df['has_roundB'] * 0.1 +
            df['has_roundC'] * 0.05 +
            df['has_roundD'] * 0.05 +
            df['age_first_funding_years'] * 0.02 +
            np.random.normal(0, 0.1, n_samples)
        )
        
        df['success'] = (success_prob > 0.5).astype(int)
        
        return df
    
    def _train_model(self):
        """Train the Random Forest model"""
        print("Training startup success prediction model...")
        
        # Generate sample data
        df = self._generate_sample_data()
        
        # Prepare features and target
        feature_columns = [
            'funding_total_usd', 'milestones', 'has_VC', 'has_angel',
            'has_roundA', 'has_roundB', 'has_roundC', 'has_roundD',
            'avg_participants', 'is_CA', 'is_NY', 'is_MA', 'is_TX',
            'is_otherstate', 'age_first_funding_years'
        ]
        
        X = df[feature_columns]
        y = df['success']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        print(f"Training accuracy: {train_score:.3f}")
        print(f"Testing accuracy: {test_score:.3f}")
        
        # Save model and scaler
        os.makedirs("models", exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        
        print("Model saved successfully!")
    
    def _load_or_train_model(self):
        """Load existing model or train new one"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                print("Startup success model loaded successfully!")
            else:
                self._train_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            self._train_model()
    
    def predict_success(self, features):
        """
        Predict startup success probability
        
        Args:
            features (dict): Dictionary containing startup features
            
        Returns:
            dict: Prediction result with success probability and class
        """
        try:
            # Prepare feature vector
            feature_vector = np.array([[
                features['funding_total_usd'],
                features['milestones'],
                features['has_VC'],
                features['has_angel'],
                features['has_roundA'],
                features['has_roundB'],
                features['has_roundC'],
                features['has_roundD'],
                features['avg_participants'],
                features['is_CA'],
                features['is_NY'],
                features['is_MA'],
                features['is_TX'],
                features['is_otherstate'],
                features['age_first_funding_years']
            ]])
            
            # Scale features
            scaled_features = self.scaler.transform(feature_vector)
            
            # Make prediction
            prediction = self.model.predict(scaled_features)[0]
            probability = self.model.predict_proba(scaled_features)[0]
            
            return {
                'success_prediction': int(prediction),
                'success_probability': float(probability[1]),
                'failure_probability': float(probability[0])
            }
            
        except Exception as e:
            print(f"Error in prediction: {e}")
            return {
                'success_prediction': 0,
                'success_probability': 0.0,
                'failure_probability': 1.0,
                'error': str(e)
            }

# Global instance
startup_success_model = StartupSuccessModel() 