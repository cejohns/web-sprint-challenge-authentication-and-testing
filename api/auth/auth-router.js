const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user-model');

const { check, validationResult } = require('express-validator');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Adjust the bcrypt salt rounds based on the environment
const bcryptSaltRounds = process.env.NODE_ENV === 'production' ? 10 : 6;

// Validation rules for user credentials
const userCredentialsValidation = [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
];

// Register endpoint
router.post('/register', userCredentialsValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username taken' });
    }

    // Use environment-specific bcrypt salt rounds
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error("Registration error:", error.message); // Improved error handling
    res.status(500).json({ message: 'There was an error registering the user', error: error.message });
  }
});

// Login endpoint
router.post('/login', userCredentialsValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
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
  } catch (error) {
    console.error("Login error:", error.message); // Similar error handling for login
    res.status(500).json({ message: 'An error occurred during login.', error: error.message });
  }
});

module.exports = router;
