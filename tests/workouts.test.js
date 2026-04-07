process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, User, Session, Exercise, Workout } = require('../database/setup');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    name: "John",
    email: "john@example.com",
    password: "pass"
  });

  const exercise = await Exercise.create({
    name: "Squat",
    muscle_group: "Legs",
    description: "Barbell squat"
  });

  await Session.create({
    user_id: user.id,
    date: "2025-04-01",
    notes: "Leg day"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Workout CRUD", () => {

  test("Create a workout", async () => {
    const res = await request(app)
      .post('/api/workouts')
      .send({
        session_id: 1,
        exercise_id: 1,
        sets: 3,
        reps: 8,
        weight: 185
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.sets).toBe(3);
  });

  test("Get all workouts", async () => {
    const res = await request(app).get('/api/workouts');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get workout (404)", async () => {
    const res = await request(app).get('/api/workouts/9999');
    expect(res.statusCode).toBe(404);
  });

  test("Update a workout", async () => {
    const res = await request(app)
      .put('/api/workouts/1')
      .send({ reps: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.reps).toBe(10);
  });

  test("Delete a workout", async () => {
    const res = await request(app).delete('/api/workouts/1');
    expect(res.statusCode).toBe(204);
  });

  test("Get deleted workout (404)", async () => {
    const res = await request(app).get('/api/workouts/1');
    expect(res.statusCode).toBe(404);
  });

});
