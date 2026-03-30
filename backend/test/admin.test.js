const request = require('supertest');

const mockUser = {
  _id: 'user-123',
  email: 'member@example.com'
};

const mockUserModel = {
  findById: jest.fn(),
};

jest.mock('../models/User', () => mockUserModel);
jest.mock('../models/ChatLog', () => ({
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      limit: jest.fn().mockResolvedValue([])
    }))
  }))
}));
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const app = require('../index');

describe('Chatbot admin route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
    delete process.env.ADMIN_EMAILS;
  });

  test('GET /api/chatbot/admin/unknown requires authentication', async () => {
    await request(app)
      .get('/api/chatbot/admin/unknown')
      .expect(401);
  });

  test('GET /api/chatbot/admin/unknown denies non-admin users', async () => {
    jwt.verify.mockReturnValue({ userId: 'user-123' });
    mockUserModel.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await request(app)
      .get('/api/chatbot/admin/unknown')
      .set('Authorization', 'Bearer valid-token')
      .expect(403);
  });
});
