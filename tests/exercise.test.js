// tests/exercises.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../database/setup');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Exercises CRUD", () => {

  test("Create exercise", async () => {
    const res = await request(app)
      .post('/api/exercises')
      .send({
        name: "Bench Press",
        muscle_group: "Chest",
        description: "Barbell bench press"
      });

    expect(res.statusCode).toBe(201);
  });

  test("Get all exercises", async () => {
    const res = await request(app).get('/api/exercises');
    expect(res.statusCode).toBe(200);
  });

});
