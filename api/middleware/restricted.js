const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this matches the secret used when signing the token

const verifyToken = (req, res, next) => {
  // Get token from the authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Authorization: Bearer <token>

  if (token == null) return res.sendStatus(401); // If no token, unauthorized

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid or expired, forbidden
    req.user = user; // Add the user payload to the request object
    next(); // Proceed to the next middleware/handler
  });
};
