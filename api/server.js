const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
//const jwt = require('jsonwebtoken');
// Assuming the middleware and routers are correctly implemented and exported
const restrict = require('./middleware/restricted.js');
const authRouter = require('./auth/auth-router.js');
const validate = require('./middleware/validate-crendentials.js');

const jokesRouter = require('./jokes/jokes-router.js');

const server = express();
const router = express.Router();
//const SECRET_KEY = process.env.SECRET || 'YOUR_SECRET_KEY';
// Basic middleware
server.use(helmet()); // Helps secure your app by setting various HTTP headers
server.use(cors()); // Enables CORS with various options
server.use(express.json()); // Parses incoming requests with JSON payloads

// Routes
// Make sure the authRouter is correctly exported as an Express router instance
server.use('/api/auth',validate, authRouter);

// Make sure the jokesRouter is correctly exported as an Express router instance
// Also ensure the 'restrict' middleware is a function that calls next() to continue the request-response cycle
server.use('/api/jokes', restrict, jokesRouter); // Only logged-in users should have access!

server.listen(3000, () => console.log('Server running on port 3000'));





server.use(router);
module.exports = server;
