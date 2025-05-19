const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, updateProfileSchema, updateStatusSchema } = require('../validations/authValidation');

describe('Validation Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('Register Validation', () => {
    it('should pass valid registration data', () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+201234567890',
        role: 'user'
      };

      const middleware = validate(registerSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject invalid email', () => {
      mockReq.body = {
        email: 'invalid-email',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+201234567890',
        role: 'user'
      };

      const middleware = validate(registerSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{
          field: 'email',
          message: '"email" must be a valid email'
        }]
      });
    });

    it('should reject weak password', () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User',
        phone: '+201234567890',
        role: 'user'
      };

      const middleware = validate(registerSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('password')
          })
        ])
      });
    });

    it('should validate business owner details', () => {
      mockReq.body = {
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

      const middleware = validate(registerSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Login Validation', () => {
    it('should pass valid login data', () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const middleware = validate(loginSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject missing credentials', () => {
      mockReq.body = {
        email: 'test@example.com'
        // Missing password
      };

      const middleware = validate(loginSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{
          field: 'password',
          message: '"password" is required'
        }]
      });
    });
  });

  describe('Profile Update Validation', () => {
    it('should pass valid profile update data', () => {
      mockReq.body = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+201234567890'
      };

      const middleware = validate(updateProfileSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject invalid phone number', () => {
      mockReq.body = {
        phone: 'invalid-phone'
      };

      const middleware = validate(updateProfileSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{
          field: 'phone',
          message: expect.stringContaining('phone')
        }]
      });
    });
  });

  describe('Status Update Validation', () => {
    it('should pass valid status update data', () => {
      mockReq.body = {
        userId: 'test-user-id',
        status: 'approved'
      };

      const middleware = validate(updateStatusSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject invalid status', () => {
      mockReq.body = {
        userId: 'test-user-id',
        status: 'invalid-status'
      };

      const middleware = validate(updateStatusSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{
          field: 'status',
          message: expect.stringContaining('status')
        }]
      });
    });

    it('should reject missing userId', () => {
      mockReq.body = {
        status: 'approved'
        // userId is missing
      };

      const middleware = validate(updateStatusSchema);
      middleware(mockReq, mockRes, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{
          field: 'userId',
          message: '"userId" is required'
        }]
      });
    });
  });
}); 