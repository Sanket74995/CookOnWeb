const request = require('supertest');

const saveMock = jest.fn();
const mockUserModel = jest.fn(function User(data) {
  Object.assign(this, data);
  this._id = this._id || 'user-123';
  this.save = saveMock;
});

mockUserModel.findOne = jest.fn();
mockUserModel.findById = jest.fn();
mockUserModel.findByIdAndUpdate = jest.fn();

jest.mock('../models/User', () => mockUserModel);
jest.mock('../models/FamilyGroup', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../index');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
  });

  test('POST /api/auth/register validates input and registers a user', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    saveMock.mockResolvedValue(undefined);
    bcrypt.hash.mockResolvedValue('hashed-password');
    jwt.sign.mockReturnValue('signed-token');

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201);

    expect(bcrypt.hash).toHaveBeenCalledWith('testPassword123', 10);
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.body).toHaveProperty('token', 'signed-token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  test('POST /api/auth/register rejects invalid payloads', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'ab',
        email: 'not-an-email',
        password: 'short',
        firstName: '',
        lastName: ''
      })
      .expect(400);
  });

  test('POST /api/auth/login requires valid credentials', async () => {
    mockUserModel.findOne.mockResolvedValue({
      _id: 'user-123',
      username: 'testuser2',
      email: 'login@test.com',
      firstName: 'Login',
      lastName: 'User',
      password: 'hashed-password'
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('login-token');

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' })
      .expect(200);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    expect(loginRes.body).toHaveProperty('token', 'login-token');
    expect(loginRes.body.user).toHaveProperty('username', 'testuser2');
  });

  test('PUT /api/auth/me rejects invalid profile updates', async () => {
    jwt.verify.mockReturnValue({ userId: 'user-123' });
    mockUserModel.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'user-123',
        email: 'user@example.com'
      })
    });

    await request(app)
      .put('/api/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .send({
        firstName: '',
        lastName: 'User',
        email: 'invalid-email'
      })
      .expect(400);
  });
});
