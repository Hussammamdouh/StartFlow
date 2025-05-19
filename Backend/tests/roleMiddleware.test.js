const { checkRole } = require('../middlewares/roleMiddleware');

describe('Role Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      user: {
        role: 'user'
      }
    };
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should allow access for matching role', () => {
    checkRole(['user'])(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should allow access for admin role regardless of required role', () => {
    mockReq.user.role = 'admin';
    checkRole(['user'])(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should reject access for non-matching role', () => {
    checkRole(['admin'])(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
  });

  it('should handle missing user object', () => {
    mockReq.user = null;
    checkRole(['user'])(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Please authenticate' });
  });

  it('should handle missing role property', () => {
    mockReq.user = {};
    checkRole(['user'])(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'User role not defined' });
  });

  it('should handle multiple roles', () => {
    checkRole(['user', 'businessOwner'])(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should reject access when user role is not in allowed roles', () => {
    mockReq.user.role = 'fundingEntity';
    checkRole(['user', 'businessOwner'])(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
  });
}); 