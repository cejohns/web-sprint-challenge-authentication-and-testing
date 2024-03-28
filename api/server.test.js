const request = require('supertest');
// Use the following line to import the server instance for testing
const server = require('../api/server');
const bcrypt = require('bcrypt');
const db = require('../data/dbConfig.js'); // Make sure this is the correct path to your db config
// Mocking bcrypt for the purpose of the test
jest.mock('bcrypt');

async function resetUsersDatabase() {
  await db('users').truncate();
}

beforeEach(async () => {
  console.log("Calling resetUsersDatabase");
  await resetUsersDatabase();
});

afterAll(() => {
  // Perform cleanup, if necessary
});

describe('POST /register', () => {
  test('successfully registers a new user', async () => {
    const mockUser = { username: 'TestUser', password: 'password123' };
    const response = await request(server).post('/api/auth/register').send(mockUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe(mockUser.username);
    // Consider adding a check for the hashed password here
  });

  test('fails to register a user with an existing username', async () => {
    // Make sure 'TestUser' exists in the database before this test runs
    const mockUser = { username: 'TestUser', password: 'newPassword123' };
    const response = await request(server).post('/api/auth/register').send(mockUser);
    expect(response.statusCode).toBe(409); // Assuming your API returns a 409 Conflict for existing user
    expect(response.body.message).toContain('username taken');
  });

  test('adds a new user with a bcrypted password', async () => {
    // 1. Create a clear test description
    // 2. Create mock user data
    const newUser = { username: 'newUser', password: 'password123' };

    // 3. Send POST request
    const response = await request(server)
      .post('/api/auth/register')
      .send(newUser);

    // 4. Check response status code
    expect(response.statusCode).toBe(201);

    // 5. Check response body
    // Assuming your endpoint returns the username of the newly created user
    expect(response.body).toHaveProperty('username', newUser.username);

    // Additional checks for hashed password can be added here if applicable
  });

});

describe('POST /login', () => {
  test('successfully logs in a user', async () => {
    // You need to ensure a user exists in your test setup for this to pass
    const mockUser = { username: 'TestUser', password: 'password123' };
    bcrypt.compare.mockResolvedValue(true); // Mock bcrypt comparison to succeed

    const response = await request(server).post('/login').send(mockUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('welcome,');
  });

  test('fails to login with incorrect credentials', async () => {
    const mockUser = { username: 'TestUser', password: 'wrongPassword' };
    bcrypt.compare.mockResolvedValue(false); // Mock bcrypt comparison to fail

    const response = await request(server).post('/login').send(mockUser);
    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('invalid credentials');
  });
});

/*function resetUsersDatabase() {
  // Implement this function to reset your users database or data structure before each test
  // This could involve clearing an array, resetting a mock database, etc.
}*/

