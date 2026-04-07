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

describe("User CRUD", () => {

    test("Create a user", async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.email).toBe("test@example.com");
    });

    test("Get all users", async () => {
        const res = await request(app).get('/api/users');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Return 404 for non-existing user", async () => {
        const res = await request(app).get('/api/users/9999');

        expect(res.statusCode).toBe(404);
    });

    test("Update a user", async () => {
        const res = await request(app)
            .put('/api/users/1')
            .send({ name: "Updated User" });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Updated User");
    });

    test("Delete a user", async () => {
        const res = await request(app).delete('/api/users/1');
        expect(res.statusCode).toBe(204);
    });

    test("Get deleted user (404)", async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(404);
    });

});
