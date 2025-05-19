# StartFlow Backend

Backend service for StartFlow - A platform connecting startups with funding entities.

## Features

- User authentication with Firebase
- Role-based access control (User, Business Owner, Admin)
- Input validation using Joi
- Swagger API documentation
- Comprehensive test suite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   JWT_SECRET=your-jwt-secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The API documentation is available at `/api/docs` when the server is running. It provides detailed information about all available endpoints, request/response schemas, and example requests.

## Testing

The project includes a comprehensive test suite covering:
- Authentication flow
- Input validation
- Middleware functionality
- Role-based access control

### Running Tests

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

- Generate test coverage report:
  ```bash
  npm run test:coverage
  ```

- Run tests in CI environment:
  ```bash
  npm run test:ci
  ```

### Test Structure

- `tests/auth.test.js`: Tests for authentication endpoints
- `tests/validate.test.js`: Tests for input validation
- `tests/authMiddleware.test.js`: Tests for authentication middleware
- `tests/roleMiddleware.test.js`: Tests for role-based access control
- `tests/helpers.js`: Test helper functions
- `tests/setup.js`: Test environment setup

## Project Structure

```
Backend/
├── config/
│   └── firebase.js
├── controllers/
│   └── authController.js
├── middlewares/
│   ├── auth.js
│   └── validate.js
├── models/
│   ├── BaseUser.js
│   ├── BusinessOwner.js
│   └── FundingEntity.js
├── routes/
│   └── authRoutes.js
├── tests/
│   ├── auth.test.js
│   ├── authMiddleware.test.js
│   ├── helpers.js
│   ├── roleMiddleware.test.js
│   ├── setup.js
│   └── validate.test.js
├── validations/
│   └── authValidation.js
├── app.js
├── jest.config.js
├── package.json
└── README.md
```

## Contributing

1. Create a new branch for your feature
2. Write tests for your changes
3. Ensure all tests pass
4. Submit a pull request

## License

This project is licensed under the MIT License. 