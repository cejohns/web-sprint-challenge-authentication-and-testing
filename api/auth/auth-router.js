const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, /*validationResult*/ } = require('express-validator');

const router = express.Router();
let users = []; // Changed to 'let' to allow modification, but not reassignment.
//const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 8;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const userCredentialsValidation = [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
];

/*function resetUsersDatabase() {
  users.length = 0; // Correct way to clear the array without reassigning.
}*/

router.post('/register', async (req, res) => {
  //const { username, password } = req.body;

  try {
    const { username, password } = req.body;
    // Your logic to hash the password with bcrypt and save the user to the database

    // Assuming newUser contains the newly created user object with an id
    const newUser = await createUser(username, hashedPassword);

    // Respond with the newly created user object
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'There was an error registering the user' });
  }
});

router.post('/login', userCredentialsValidation, async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(200).send("Invalid credentials");
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
      res.json({ message: `Welcome, ${username}`, token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during login.");
  }
});

// Correctly exporting both the router and the function
module.exports = router;
