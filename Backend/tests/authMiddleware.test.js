const request = require('supertest');
const app = require('../app');
const { auth, db } = require('../config/firebase');

// Mock Firebase Admin
jest.mock('../config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn(),
    getUserByEmail: jest.fn()
  },
  db: {
    collection: jest.fn()
  }
}));

describe('Authentication Middleware', () => {
  let mockUser;
  let mockToken;

  beforeEach(() => {
    mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      role: 'user',
      status: 'approved'
    };
    mockToken = 'test-token';
    jest.clearAllMocks();
  });

  it('should authenticate valid token', async () => {
    auth.verifyIdToken.mockResolvedValue(mockUser);
    db.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => mockUser
        })
      })
    });

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(auth.verifyIdToken).toHaveBeenCalledWith(mockToken);
  });

  it('should reject missing token', async () => {
    const response = await request(app)
      .get('/api/auth/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Please authenticate');
  });

  it('should reject invalid token format', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'InvalidFormat');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Please authenticate');
  });

  it('should reject expired token', async () => {
    auth.verifyIdToken.mockRejectedValueOnce(new Error('Token expired'));

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Please authenticate');
  });

  it('should reject non-existent user', async () => {
    auth.verifyIdToken.mockResolvedValue(mockUser);
    db.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: false
        })
      })
    });

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Please authenticate');
  });

  it('should handle Firebase auth errors', async () => {
    auth.verifyIdToken.mockRejectedValueOnce(new Error('Firebase auth error'));

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Please authenticate');
  });
}); 