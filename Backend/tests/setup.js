// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  auth: () => ({
    createUser: jest.fn(),
    verifyIdToken: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUser: jest.fn(),
    listUsers: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createCustomToken: jest.fn()
  }),
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn()
      })),
      where: jest.fn(() => ({
        get: jest.fn()
      })),
      get: jest.fn()
    }))
  })
}));

// Mock Firebase config
jest.mock('../config/firebase', () => ({
  auth: {
    createUser: jest.fn(),
    createCustomToken: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    verifyIdToken: jest.fn(),
    getUserByEmail: jest.fn()
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn()
      })),
      where: jest.fn(() => ({
        get: jest.fn()
      })),
      get: jest.fn()
    }))
  }
}));

// Set test environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_PRIVATE_KEY = 'test-key';
process.env.FIREBASE_CLIENT_EMAIL = 'test@test.com';
process.env.NODE_ENV = 'test';
process.env.PORT = 3001; 