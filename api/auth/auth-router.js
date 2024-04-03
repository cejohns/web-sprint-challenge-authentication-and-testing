const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const User = require('../users/users-model');
 const uniqueUsername = require('../middleware/unique-username');
 const usernameExists = require('../middleware/username-exists');
 const validateCrendentials = require('../middleware/validate-crendentials');

const secret = process.env.SECRET || 'the secret';
const userCredentialsValidation = require('../middleware/restricted');
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secret, options);
}

router.post('/register',  uniqueUsername,validateCrendentials, async (req, res) => {
  // console.log('Starting user registration...');
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   console.log('Validation errors:', errors.array());
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // const { username, password } = req.body;

  // // Check if the username already exists in the users array
  // const existingUser = users.findById(req.params.id);

  // if (existingUser) {
  //   res.status(400).json({
  //     message: 'Username already exists'
  //   })
     
  // }

  // try {
  //   console.log('Hashing password...');
  //   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  //   console.log('Password hashed:', hashedPassword);

  //   const newUser = { userId: users.length + 1, username, password: hashedPassword };
  //   console.log('New user object:', newUser);

  //   users.push(newUser); // Successfully adds the new user
  //   console.log('User added to array:', users);

  //   res.status(201).json(newUser); // This line should now only execute if the username is not taken
  //   console.log('Response sent with newUser:', newUser);
  // } catch (error) {
  //   console.error('Error registering user:', error);
  //   res.status(500).json({ message: 'There was an error registering the user', error: error.message });
  // }
  try {
    const { username, password } = req.body;
    const newUser = await User.add({
      username,
      password: bcrypt.hashSync(password, 8),
    });
    console.log('New User:', newUser);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      // This checks if the error message includes 'UNIQUE constraint failed'
      res.status(400).json({ message: 'Username taken' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});



router.post('/login', userCredentialsValidation,validateCrendentials,usernameExists, async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // const { username, password } = req.body;
  // const user = users.findById(req.params.id);
  // if (!user) {
  //   return res.status(401).json({ message: 'Invalid credentials' });
  // }

  // try {
  //   const match = await bcrypt.compare(password, user.password);
  //   if (match) {
  //     const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
  //     res.json({ message: `Welcome, ${username}`, token });
  //   } else {
  //     res.status(401).json({ message: 'Invalid credentials' });
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'An error occurred during login.' });
  // }
  try {
    const { password } = req.body;
    const { user } = req; // Assuming the user was attached by usernameExists middleware

    if (bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: `welcome, ${user.username}`, token: generateToken(user) });
    } else {
      res.status(401).json({ message: 'invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
