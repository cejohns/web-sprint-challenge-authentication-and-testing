//const jwt = require('jsonwebtoken');
//const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this matches the secret used when signing the token

module.exports = function restrict(req, res, next) {
  // Your authentication logic here...
  // If authenticated
  next();
  // else
  // res.status(401).send('No access');
};