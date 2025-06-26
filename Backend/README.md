# StartFlow Backend

Backend service for StartFlow - An AI-powered platform connecting startups with funding entities.

## 🚀 Features

- **Authentication & Authorization**
  - Firebase Authentication integration
  - Role-based access control (User, Business Owner, Funding Entity, Admin)
  - JWT token management with blacklisting
  - Secure password handling

- **AI-Powered Features**
  - Company recommendations based on industry
  - Startup success probability prediction
  - Profit prediction based on spending allocation
  - TF-IDF similarity matching
  - Machine learning model integration

- **Business Features**
  - Funding request management
  - Funding offer system
  - Community posts and interactions
  - Real-time chat functionality
  - Admin dashboard and user management

- **Security & Performance**
  - Comprehensive input validation using Joi
  - Rate limiting and DDoS protection
  - XSS and CSRF protection
  - Helmet security headers
  - CORS configuration

- **Documentation & Testing**
  - Swagger API documentation
  - Comprehensive test suite with Jest
  - Code coverage reporting
  - ESLint and Prettier configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Firebase project with Authentication and Firestore enabled
- AI service running on port 8000 (for AI features)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StartFlow/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email@your-project.iam.gserviceaccount.com
   FIREBASE_API_KEY=your-firebase-api-key
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   
   # AI Service Configuration
   AI_SERVICE_URL=http://localhost:8000
   AI_SERVICE_TIMEOUT=30000
   
   # Security Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   RATE_LIMIT_MAX=100
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

The API documentation is available at `/api/docs` when the server is running. It provides:

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Request/Response Schemas**: Detailed data models and examples
- **Authentication**: Bearer token authentication documentation
- **AI Endpoints**: Comprehensive documentation for all AI features
- **Error Handling**: Standardized error responses

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

#### AI Features
- `GET /api/ai/status` - AI service status
- `GET /api/ai/health` - AI service health check
- `POST /api/ai/recommendations` - Get company recommendations
- `POST /api/ai/predict-startup-success` - Predict startup success
- `POST /api/ai/predict-profit` - Predict profit based on spending

#### Business Features
- `GET /api/funding-requests` - List funding requests
- `POST /api/funding-requests` - Create funding request
- `GET /api/community/posts` - List community posts
- `POST /api/community/posts` - Create community post

## 🧪 Testing

The project includes a comprehensive test suite covering:

- Authentication flow and middleware
- Input validation and error handling
- Role-based access control
- AI service integration
- API endpoint functionality

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run tests in CI environment
npm run test:ci

# Debug tests
npm run test:debug
```

### Test Structure

- `tests/auth.test.js` - Authentication endpoint tests
- `tests/validate.test.js` - Input validation tests
- `tests/authMiddleware.test.js` - Authentication middleware tests
- `tests/roleMiddleware.test.js` - Role-based access control tests
- `tests/helpers.js` - Test helper functions
- `tests/setup.js` - Test environment setup

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Security audit
npm run audit

# Fix security issues
npm run audit:fix
```

### Git Hooks

The project uses Husky for Git hooks:
- Pre-commit: Runs linting and formatting
- Pre-push: Runs tests

## 📁 Project Structure

```
Backend/
├── config/
│   ├── config.js          # Application configuration
│   └── firebase.js        # Firebase configuration
├── controllers/
│   ├── aiController.js    # AI feature controllers
│   ├── authController.js  # Authentication controllers
│   ├── chatController.js  # Chat functionality
│   ├── communityController.js # Community features
│   ├── fundingController.js   # Funding management
│   └── adminController.js     # Admin functionality
├── middlewares/
│   ├── auth.js            # Authentication middleware
│   ├── validate.js        # Input validation middleware
│   └── roleMiddleware.js  # Role-based access control
├── models/
│   ├── BaseUser.js        # Base user model
│   ├── BusinessOwner.js   # Business owner model
│   ├── FundingEntity.js   # Funding entity model
│   ├── FundingRequest.js  # Funding request model
│   ├── FundingOffer.js    # Funding offer model
│   ├── CommunityPost.js   # Community post model
│   ├── Chat.js            # Chat model
│   └── Message.js         # Message model
├── routes/
│   ├── aiRoutes.js        # AI feature routes
│   ├── authRoutes.js      # Authentication routes
│   ├── fundingRoutes.js   # Funding routes
│   ├── communityRoutes.js # Community routes
│   ├── chatRoutes.js      # Chat routes
│   └── adminRoutes.js     # Admin routes
├── services/
│   ├── aiService.js       # AI service client
│   ├── chatService.js     # Chat service
│   └── socketService.js   # Socket.IO service
├── utils/
│   ├── errorHandler.js    # Error handling utilities
│   └── tokenBlacklist.js  # Token blacklisting
├── validations/
│   ├── authValidation.js  # Authentication validation schemas
│   ├── fundingValidation.js # Funding validation schemas
│   └── communityValidation.js # Community validation schemas
├── tests/
│   ├── auth.test.js       # Authentication tests
│   ├── validate.test.js   # Validation tests
│   └── helpers.js         # Test helpers
├── app.js                 # Main application file
├── swagger.yaml           # API documentation
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

2. **Security Considerations**
   - Use strong JWT secrets
   - Configure proper CORS origins
   - Enable rate limiting
   - Use HTTPS in production

3. **Performance Optimization**
   - Enable compression
   - Use CDN for static assets
   - Implement caching strategies
   - Monitor application performance

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the test files for usage examples

## 🔗 Related Projects

- [StartFlow Frontend](link-to-frontend) - React-based frontend application
- [StartFlow AI Service](link-to-ai-service) - Python FastAPI AI service 