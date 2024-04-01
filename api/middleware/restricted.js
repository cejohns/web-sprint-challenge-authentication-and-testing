const jwt = require('jsonwebtoken');

// Assuming 'YOUR_SECRET_KEY' is the secret key you used to sign the JWTs.
const SECRET_KEY = 'YOUR_SECRET_KEY';

module.exports = (req, res, next) => {
  // Extract the token from the Authorization header.
  const token = req.headers.authorization?.split(' ')[1]; // Conventionally, Authorization: Bearer <token>

  if (!token) {
    // Token is missing from the Authorization header.
    return res.status(401).json({ message: "token required" });
  }

  // Verify the token.
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Token is invalid or expired.
      return res.status(401).json({ message: "token invalid" });
    }

    // Token is valid, proceed to the next middleware or route handler.
    req.user = decoded; // Optional: Attach the decoded token to the request if you want to use it downstream.
    next();
  });
};