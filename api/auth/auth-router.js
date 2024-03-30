const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user-model');
const { check, validationResult } = require('express-validator');

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Please set it in the environment variables.");
  process.exit(1);
}

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSaltRounds = process.env.NODE_ENV === 'test' ? 4 : 10; // Lower for testing environment

// Middleware for request validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Async handler to automatically catch errors in async functions
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Validation rules for user credentials
const userCredentialsValidation = [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
];

// Register endpoint
router.post('/register', userCredentialsValidation, validateRequest, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username taken' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
  const newUser = new User({
    username,
    password: hashedPassword
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
}));

// Login endpoint
router.post('/login', userCredentialsValidation, validateRequest, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ message: `Welcome, ${username}`, token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}));

// Error handling middleware
router.use((error, req, res, next) => {
  console.error(error.message); // Log the error for debugging
  res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
});

module.exports = router;
