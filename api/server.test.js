const request = require('supertest');
const server = require('../api/server'); // Adjust the path to match your actual server file location
const db = require('../data/dbConfig'); // Ensure this points to your database configuration
//const bcrypt = require('bcrypt');
// Helper function to reset the users table before each test
async function resetUsersDatabase() {
    await db('users').truncate();
}



// Helper function to create a test user and get a token
async function getValidToken() {
    const userData = { username: 'testUser', password: 'password' };
    await request(server).post('/api/auth/register').send(userData);
    const response = await request(server).post('/api/auth/login').send(userData);
    return response.body.token; // Assuming the response contains a token
}

beforeEach(async () => {
    await resetUsersDatabase();
});

describe('Auth Endpoints', () => {
    test('POST /api/auth/register - successfully registers a user', async () => {
        const userData = { username: 'testUser', password: 'password' };
        const response = await request(server).post('/api/auth/register').send(userData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('username', userData.username);
    });

    test('POST /api/auth/register - fails to register a user with an existing username', async () => {
        const userData = { username: 'testUser', password: 'password' };
        await request(server).post('/api/auth/register').send(userData);
        const response = await request(server).post('/api/auth/register').send(userData);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Username taken');
    });

    test('POST /api/auth/login - successfully logs in a user', async () => {
        const userData = { username: 'testUser', password: 'password' };
        await request(server).post('/api/auth/register').send(userData);
        const response = await request(server).post('/api/auth/login').send(userData);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - fails with invalid credentials', async () => {
        const userData = { username: 'testUser', password: 'wrongPassword' };
        const response = await request(server).post('/api/auth/login').send(userData);
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
});

describe('Jokes Endpoint', () => {
    test('GET /api/jokes - successfully retrieves jokes with valid token', async () => {
        const token = await getValidToken();
        const response = await request(server)
            .get('/api/jokes')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/jokes - denies access without token', async () => {
        const response = await request(server).get('/api/jokes');
        expect(response.statusCode).toBe(401); // Expecting access to be denied without a valid token
        expect(response.body).toHaveProperty('message', 'token required'); // Optional: checking for the specific error message
    });
    
});

