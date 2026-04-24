// tests/sessions.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, User, Session } = require('../database/setup');

let clientToken;
let trainerToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create trainer
  await request(app).post('/api/auth/register').send({
    name: "Trainer",
    email: "trainer@example.com",
    password: "trainerpass",
    role: "trainer"
  });

  const trainerLogin = await request(app).post('/api/auth/login').send({
    email: "trainer@example.com",
    password: "trainerpass"
  });

  trainerToken = trainerLogin.body.token;

  // Create client
  await request(app).post('/api/auth/register').send({
    name: "Client",
    email: "client@example.com",
    password: "clientpass",
    role: "client"
  });

  const clientLogin = await request(app).post('/api/auth/login').send({
    email: "client@example.com",
    password: "clientpass"
  });

  clientToken = clientLogin.body.token;

  // Create session for client
  await request(app)
    .post('/api/sessions')
    .set('Authorization', `Bearer ${clientToken}`)
    .send({
      user_id: 2,
      date: "2025-04-01",
      notes: "Leg day"
    });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Sessions CRUD with roles", () => {

  test("Trainer can get all sessions", async () => {
    const res = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${trainerToken}`);

    expect(res.statusCode).toBe(200);
  });

  test("Client cannot get all sessions", async () => {
    const res = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("Client can get their own session", async () => {
    const res = await request(app)
      .get('/api/sessions/1')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
  });

});
