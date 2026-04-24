// tests/workouts.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, User, Session, Exercise } = require('../database/setup');

let trainerToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Trainer
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

  // Create exercise
  await Exercise.create({
    name: "Squat",
    muscle_group: "Legs",
    description: "Barbell squat"
  });

  // Create session
  await Session.create({
    user_id: 1,
    date: "2025-04-01",
    notes: "Leg day"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Workouts CRUD with roles", () => {

  test("Trainer can create workout", async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        session_id: 1,
        exercise_id: 1,
        sets: 3,
        reps: 8,
        weight: 185
      });

    expect(res.statusCode).toBe(201);
  });

  test("Trainer can update workout", async () => {
    const res = await request(app)
      .put('/api/workouts/1')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({ reps: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.reps).toBe(10);
  });

});
