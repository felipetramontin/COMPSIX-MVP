// tests/users.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../database/setup');

let adminToken;
let clientToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create admin
  await request(app).post('/api/auth/register').send({
    name: "Admin",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin"
  });

  const adminLogin = await request(app).post('/api/auth/login').send({
    email: "admin@example.com",
    password: "adminpass"
  });

  adminToken = adminLogin.body.token;

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
});

afterAll(async () => {
  await sequelize.close();
});

describe("Users CRUD with roles", () => {

  test("Admin can get all users", async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Client cannot get all users", async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("Client can get their own profile", async () => {
    const res = await request(app)
      .get('/api/users/2')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
  });

  test("Client cannot delete users", async () => {
    const res = await request(app)
      .delete('/api/users/2')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("Admin can delete a user", async () => {
    const res = await request(app)
      .delete('/api/users/2')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

});
