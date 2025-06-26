import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample data for recommendations
COMPANY_DATA = [
    {"Company Name": "Swvl", "Industry": "Transport", "Funding Amount": "197 million", "Market Size": "Large"},
    {"Company Name": "Fawry", "Industry": "Digital Payments", "Funding Amount": "470 million", "Market Size": "Large"},
    {"Company Name": "Vezeeta", "Industry": "Healthcare", "Funding Amount": "296 million", "Market Size": "Medium"},
    {"Company Name": "Trella", "Industry": "Logistics", "Funding Amount": "197 million", "Market Size": "Medium"},
    {"Company Name": "MaxAB", "Industry": "E-commerce", "Funding Amount": "188 million", "Market Size": "Large"},
    {"Company Name": "Almentor", "Industry": "E-learning", "Funding Amount": "282 million", "Market Size": "Medium"},
    {"Company Name": "Education Hub", "Industry": "E-learning", "Funding Amount": "329 million", "Market Size": "Medium"},
    {"Company Name": "Ebtikar", "Industry": "Fintech", "Funding Amount": "705 million", "Market Size": "Large"},
    {"Company Name": "Paymob", "Industry": "Fintech", "Funding Amount": "846 million", "Market Size": "Large"},
    {"Company Name": "City Edge", "Industry": "Real Estate", "Funding Amount": "658 million", "Market Size": "Large"},
    {"Company Name": "Misr City Housing", "Industry": "Real Estate", "Funding Amount": "470 million", "Market Size": "Large"},
    {"Company Name": "Swedy Electric", "Industry": "Industry & Energy", "Funding Amount": "188 million", "Market Size": "Medium"},
    {"Company Name": "Talaat Moustafa Group", "Industry": "Real Estate", "Funding Amount": "517 million", "Market Size": "Large"},
    {"Company Name": "National Bank of Egypt", "Industry": "Banking", "Funding Amount": "470 million", "Market Size": "Large"},
    {"Company Name": "Banque Misr", "Industry": "Banking", "Funding Amount": "470 million", "Market Size": "Large"},
    {"Company Name": "Commercial International Bank", "Industry": "Banking", "Funding Amount": "564 million", "Market Size": "Large"},
    {"Company Name": "A15", "Industry": "Venture Capital", "Funding Amount": "282 million", "Market Size": "Medium"},
    {"Company Name": "Endeavor Egypt", "Industry": "Venture Capital", "Funding Amount": "282 million", "Market Size": "Medium"},
    {"Company Name": "Sawari Ventures", "Industry": "Venture Capital", "Funding Amount": "235 million", "Market Size": "Medium"},
    {"Company Name": "Flat6Labs", "Industry": "Venture Capital", "Funding Amount": "188 million", "Market Size": "Medium"},
    {"Company Name": "Qudra", "Industry": "Fintech", "Funding Amount": "47 million", "Market Size": "Small"},
    {"Company Name": "Shezlong", "Industry": "Healthcare", "Funding Amount": "470 million", "Market Size": "Medium"},
    {"Company Name": "Instabug", "Industry": "Tech", "Funding Amount": "235 million", "Market Size": "Medium"},
    {"Company Name": "Eventtus", "Industry": "Tech", "Funding Amount": "188 million", "Market Size": "Small"},
    {"Company Name": "Cluep", "Industry": "Tech", "Funding Amount": "141 million", "Market Size": "Small"},
    {"Company Name": "Elmenus", "Industry": "E-commerce", "Funding Amount": "235 million", "Market Size": "Medium"},
    {"Company Name": "ElGouna", "Industry": "Tourism", "Funding Amount": "517 million", "Market Size": "Large"},
    {"Company Name": "Orange Egypt", "Industry": "Telecommunications", "Funding Amount": "1175 million", "Market Size": "Large"},
    {"Company Name": "Valeo Egypt", "Industry": "Technology", "Funding Amount": "470 million", "Market Size": "Large"},
    {"Company Name": "Jumia Egypt", "Industry": "E-commerce", "Funding Amount": "188 million", "Market Size": "Large"},
    {"Company Name": "Careem", "Industry": "Transport", "Funding Amount": "235 million", "Market Size": "Large"},
    {"Company Name": "Uber Egypt", "Industry": "Transport", "Funding Amount": "141 million", "Market Size": "Large"},
    {"Company Name": "Amazon Egypt", "Industry": "E-commerce", "Funding Amount": "282 million", "Market Size": "Large"},
    {"Company Name": "ElAraby Group", "Industry": "Retail", "Funding Amount": "213 million", "Market Size": "Large"},
    {"Company Name": "Seera Group", "Industry": "Travel", "Funding Amount": "470 million", "Market Size": "Medium"},
    {"Company Name": "Tawarruq", "Industry": "Fintech", "Funding Amount": "587 million", "Market Size": "Medium"},
    {"Company Name": "Cashfree", "Industry": "Fintech", "Funding Amount": "611 million", "Market Size": "Medium"},
    {"Company Name": "Ally Invest", "Industry": "Investment", "Funding Amount": "290 million", "Market Size": "Medium"},
    {"Company Name": "Fatura", "Industry": "Fintech", "Funding Amount": "115 million", "Market Size": "Small"},
    {"Company Name": "Upwork Egypt", "Industry": "Technology", "Funding Amount": "470 million", "Market Size": "Large"},
    {"Company Name": "Teady", "Industry": "E-commerce", "Funding Amount": "705 million", "Market Size": "Medium"},
    {"Company Name": "Go Bus", "Industry": "Transport", "Funding Amount": "752 million", "Market Size": "Large"},
    {"Company Name": "Dirb", "Industry": "Transport", "Funding Amount": "611 million", "Market Size": "Medium"},
    {"Company Name": "Logistics Plus", "Industry": "Logistics", "Funding Amount": "799 million", "Market Size": "Medium"},
    {"Company Name": "CargoX", "Industry": "Logistics", "Funding Amount": "752 million", "Market Size": "Medium"},
    {"Company Name": "Shahiya", "Industry": "E-commerce", "Funding Amount": "893 million", "Market Size": "Medium"},
    {"Company Name": "Ramsys", "Industry": "Healthcare", "Funding Amount": "470 million", "Market Size": "Medium"},
    {"Company Name": "Shetab", "Industry": "Fintech", "Funding Amount": "350 million", "Market Size": "Medium"},
    {"Company Name": "Infinity Media", "Industry": "Advertising", "Funding Amount": "692 million", "Market Size": "Medium"},
    {"Company Name": "Platinum Real Estate", "Industry": "Real Estate", "Funding Amount": "350 million", "Market Size": "Medium"},
    {"Company Name": "Reyada Group", "Industry": "Real Estate", "Funding Amount": "820 million", "Market Size": "Large"},
    {"Company Name": "Carriage", "Industry": "Food Delivery", "Funding Amount": "820 million", "Market Size": "Medium"},
    {"Company Name": "Zed", "Industry": "Retail", "Funding Amount": "585 million", "Market Size": "Medium"},
    {"Company Name": "DriveMe", "Industry": "Transport", "Funding Amount": "551 million", "Market Size": "Medium"},
    {"Company Name": "Taskty", "Industry": "Technology", "Funding Amount": "564 million", "Market Size": "Medium"},
    {"Company Name": "Cook Door", "Industry": "Food", "Funding Amount": "705 million", "Market Size": "Medium"},
    {"Company Name": "Aqarmap", "Industry": "Real Estate", "Funding Amount": "541 million", "Market Size": "Medium"},
]

class RecommendationModel:
    def __init__(self):
        self.df = pd.DataFrame(COMPANY_DATA)
        self.vectorizer = None
        self.tfidf_matrix = None
        self._prepare_model()
    
    def _prepare_model(self):
        """Prepare the TF-IDF model"""
        # Combine industry and company name for better matching
        self.df['Combined'] = self.df['Industry'] + " " + self.df['Company Name']
        
        # Initialize TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['Combined'])
    
    def get_recommendations(self, industry_input: str, top_n: int = 6):
        """
        Get company recommendations based on industry input
        
        Args:
            industry_input (str): The industry to search for
            top_n (int): Number of recommendations to return
            
        Returns:
            list: List of recommended companies
        """
        try:
            # Transform input using the same vectorizer
            industry_input_tfidf = self.vectorizer.transform([industry_input])
            
            # Calculate cosine similarities
            cosine_similarities = cosine_similarity(industry_input_tfidf, self.tfidf_matrix).flatten()
            
            # Add similarity scores to dataframe
            df_with_scores = self.df.copy()
            df_with_scores['Cosine Similarity'] = cosine_similarities
            
            # Sort by similarity and get top recommendations
            recommendations = df_with_scores.sort_values(by='Cosine Similarity', ascending=False)
            
            # Return top N recommendations
            top_recommendations = recommendations[['Company Name', 'Industry', 'Funding Amount', 'Market Size']].head(top_n)
            
            return top_recommendations.to_dict('records')
            
        except Exception as e:
            print(f"Error in recommendation: {e}")
            # Return top companies by funding amount as fallback
            return self.df.nlargest(top_n, 'Funding Amount')[['Company Name', 'Industry', 'Funding Amount', 'Market Size']].to_dict('records')

# Global instance
recommendation_model = RecommendationModel() 