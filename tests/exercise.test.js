process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, Exercise } = require('../database/setup');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Exercise CRUD", () => {

  test("Create an exercise", async () => {
    const res = await request(app)
      .post('/api/exercises')
      .send({
        name: "Bench Press",
        muscle_group: "Chest",
        description: "Barbell bench press"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Bench Press");
  });

  test("Get all exercises", async () => {
    const res = await request(app).get('/api/exercises');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get exercise (404)", async () => {
    const res = await request(app).get('/api/exercises/9999');
    expect(res.statusCode).toBe(404);
  });

  test("Update an exercise", async () => {
    const res = await request(app)
      .put('/api/exercises/1')
      .send({ description: "Updated description" });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Updated description");
  });

  test("Delete an exercise", async () => {
    const res = await request(app).delete('/api/exercises/1');
    expect(res.statusCode).toBe(204);
  });

  test("Get deleted exercise (404)", async () => {
    const res = await request(app).get('/api/exercises/1');
    expect(res.statusCode).toBe(404);
  });

});
