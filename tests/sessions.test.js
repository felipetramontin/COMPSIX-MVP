process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { sequelize, User, Session } = require('../database/setup');

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await User.create({
        name: "John",
        email: "john@example.com",
        password: "pass"
    });
});

afterAll(async () => {
    await sequelize.close();
});

describe("Session CRUD", () => {

    test("Create a session", async () => {
        const res = await request(app)
            .post('/api/sessions')
            .send({
                user_id: 1,
                date: "2025-04-01",
                notes: "Test session"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.user_id).toBe(1);
    });

    test("Get all sessions", async () => {
        const res = await request(app).get('/api/sessions');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Update a session", async () => {
        const res = await request(app)
            .put('/api/sessions/1')
            .send({ notes: "Updated notes" });

        expect(res.statusCode).toBe(200);
        expect(res.body.notes).toBe("Updated notes");
    });

    test("Delete a session", async () => {
        const res = await request(app).delete('/api/sessions/1');
        expect(res.statusCode).toBe(204);
    });

    test("Get deleted session (404)", async () => {
        const res = await request(app).get('/api/sessions/1');
        expect(res.statusCode).toBe(404);
    });

});
