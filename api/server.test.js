const request = require('supertest');
// Use the following line to import the server instance for testing
const server = require('../api/server');
const bcrypt = require('bcrypt');
const db = require('../data/dbConfig.js'); // Make sure this is the correct path to your db config
// Mocking bcrypt for the purpose of the test
const jokesRouter = require('./jokes/jokes-router.js');

jest.mock('bcrypt');

server.use('/jokes', jokesRouter);

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
 // Test successful user registration
test('registers a new user successfully', async () => {
  const newUser = { username: 'Ned', password: 'password123' };
  const response = await request(server).post('/api/auth/register').send(newUser);
  
  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('username', newUser.username);
  // Add any other assertions, e.g., response structure
});

// Test registration with an existing username
test('handles duplicate username on registration', async () => {
  const duplicateUser = { username: 'existingUser', password: 'password123' };
  // Assuming 'existingUser' is already in the database
  const response = await request(server).post('/api/auth/register').send(duplicateUser);
  
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('message', 'Username already exists');
});


});

describe('POST /login', () => {
  test('successfully logs in a user', async () => {
    // You need to ensure a user exists in your test setup for this to pass
    const mockUser = { username: 'Ned', password: 'password123' };
    bcrypt.compare.mockResolvedValue(true); // Mock bcrypt comparison to succeed

    const response = await request(server).post('/login').send(mockUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('welcome,');
  });

  test('fails to login with incorrect credentials', async () => {
    const mockUser = { username: 'ned', password: 'wrongPassword' };
    bcrypt.compare.mockResolvedValue(false); // Mock bcrypt comparison to fail

    const response = await request(server).post('/login').send(mockUser);
    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('invalid credentials');
  });
});

describe('GET /jokes endpoint', () => {
  test('responds with a list of jokes in JSON format', async () => {
    const response = await request(server).get('/jokes');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toBeInstanceOf(Array);
    // Additional assertions as needed
  });

  test('GET / - successfully retrieves jokes', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Assuming the response is an array of jokes
    // Additional checks can be made here regarding the length of the array or the structure of a joke object
  });
});



