const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

const app = require('../index');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (let key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }
});

describe('Auth API', () => {
  test('POST /api/auth/register should validate input and register user', async () => {
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

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  test('POST /api/auth/login should require valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'login@test.com',
        password: 'password123',
        firstName: 'Login',
        lastName: 'User'
      })
      .expect(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' })
      .expect(200);

    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body.user).toHaveProperty('username', 'testuser2');
  });
});
