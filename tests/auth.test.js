// tests/auth.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../database/setup');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth", () => {

  test("Register a user", async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: "John",
        email: "john@example.com",
        password: "pass123",
        role: "client"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("john@example.com");
  });

  test("Login returns a token", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "john@example.com",
        password: "pass123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
