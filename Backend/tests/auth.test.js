const request = require('supertest');
const { auth, db } = require('../config/firebase');
const app = require('../app');

// Mock Firebase Auth and Firestore
jest.mock('../config/firebase', () => ({
  auth: {
    createUser: jest.fn(),
    createCustomToken: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    verifyIdToken: jest.fn()
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn()
      })),
      where: jest.fn(() => ({
        get: jest.fn()
      })),
      get: jest.fn()
    }))
  }
}));

describe('Authentication System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUserData = {
    email: 'test@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '+201234567890',
    role: 'user'
  };

  const validBusinessOwnerData = {
    email: 'business@example.com',
    password: 'Password123!',
    firstName: 'Business',
    lastName: 'Owner',
    phone: '+201234567890',
    role: 'businessOwner',
    businessName: 'Test Business',
    businessOwnerName: 'Business Owner',
    idNumber: '1234567890',
    idPhoto: 'photo-url',
    teamSize: 10,
    taxRegister: 'TR123456',
    businessEmail: 'business@example.com',
    businessPhone: '+201234567890',
    businessLocation: 'Cairo, Egypt',
    businessIndustry: 'Technology',
    fundingRounds: 0,
    fundingTotal: '0'
  };

  const validLoginData = {
    email: 'test@example.com',
    password: 'Password123!'
  };

  const statusUpdate = {
    userId: 'test-user-id',
    status: 'approved'
  };

  describe('Registration', () => {
    it('should register a regular user successfully', async () => {
      const mockUserRecord = { uid: 'test-uid' };
      const mockToken = 'test-token';
      
      auth.createUser.mockResolvedValueOnce(mockUserRecord);
      auth.createCustomToken.mockResolvedValueOnce(mockToken);
      
      const mockDoc = {
        set: jest.fn().mockResolvedValueOnce()
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };
      db.collection.mockReturnValue(mockCollection);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.message).toBe('Registration successful');
    });

    it('should register a business owner successfully', async () => {
      const mockUserRecord = { uid: 'test-uid' };
      const mockToken = 'test-token';
      
      auth.createUser.mockResolvedValueOnce(mockUserRecord);
      auth.createCustomToken.mockResolvedValueOnce(mockToken);
      
      const mockDoc = {
        set: jest.fn().mockResolvedValueOnce()
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };
      db.collection.mockReturnValue(mockCollection);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validBusinessOwnerData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.message).toContain('pending approval');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'password'
        })
      );
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockToken = 'test-token';
      
      auth.signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
      auth.createCustomToken.mockResolvedValueOnce(mockToken);
      
      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          data: () => ({
            ...validLoginData,
            status: 'approved'
          })
        }]
      };
      const mockQuery = {
        get: jest.fn().mockResolvedValueOnce(mockQuerySnapshot)
      };
      const mockCollection = {
        where: jest.fn().mockReturnValue(mockQuery)
      };
      db.collection.mockReturnValue(mockCollection);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject login for pending users', async () => {
      const mockUser = { uid: 'test-uid' };
      
      auth.signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
      
      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          data: () => ({
            ...validLoginData,
            status: 'pending'
          })
        }]
      };
      const mockQuery = {
        get: jest.fn().mockResolvedValueOnce(mockQuerySnapshot)
      };
      const mockCollection = {
        where: jest.fn().mockReturnValue(mockQuery)
      };
      db.collection.mockReturnValue(mockCollection);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData);

      expect(response.status).toBe(403);
    });
  });

  describe('Profile Management', () => {
    const mockUser = {
      uid: 'test-uid',
      role: 'user',
      status: 'approved'
    };

    beforeEach(() => {
      auth.verifyIdToken.mockResolvedValueOnce({ uid: mockUser.uid });
    });

    it('should get user profile', async () => {
      const mockDocSnapshot = {
        exists: true,
        data: () => mockUser
      };
      const mockDoc = {
        get: jest.fn().mockResolvedValueOnce(mockDocSnapshot)
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };
      db.collection.mockReturnValue(mockCollection);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });

    it('should update user profile', async () => {
      const updates = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const mockDocSnapshot = {
        exists: true,
        data: () => mockUser
      };
      const mockDoc = {
        get: jest.fn().mockResolvedValueOnce(mockDocSnapshot),
        update: jest.fn().mockResolvedValueOnce()
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };
      db.collection.mockReturnValue(mockCollection);

      const response = await request(app)
        .patch('/api/auth/profile')
        .set('Authorization', 'Bearer test-token')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('Admin Operations', () => {
    beforeEach(() => {
      // Mock admin user
      auth.verifyIdToken.mockResolvedValue({
        uid: 'admin-uid',
        email: 'admin@example.com'
      });

      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({
              uid: 'admin-uid',
              email: 'admin@example.com',
              role: 'admin',
              status: 'approved'
            })
          })
        }),
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: 'user1',
              data: () => ({
                email: 'user1@example.com',
                role: 'user',
                status: 'pending'
              })
            },
            {
              id: 'user2',
              data: () => ({
                email: 'user2@example.com',
                role: 'businessOwner',
                status: 'approved'
              })
            }
          ]
        })
      });
    });

    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/auth/users')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should update user status', async () => {
      const response = await request(app)
        .patch('/api/auth/users/test-user-id/status')
        .set('Authorization', 'Bearer test-token')
        .send(statusUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.status).toBe('approved');
    });
  });
}); 