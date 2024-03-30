const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../user/user-model'); // Adjust the import based on your setup

const router = express.Router();
let users = []; // Changed to 'let' to allow modification, but not reassignment.
//const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 8;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const userCredentialsValidation = [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
];

router.post('/register', userCredentialsValidation, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    // Respond with the new user (excluding the password for security)
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'There was an error registering the user', error: error.message });
  }
});



router.post('/login', userCredentialsValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
      res.json({ message: `Welcome, ${username}`, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

module.exports = router;