const jwt = require('jsonwebtoken');

// Assuming you have a secret key for JWT verification
// This should be the same key used for generating the token
const secret = process.env.JWT_SECRET || 'your_secret_key_here';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("token required");
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      // This means the token is invalid or expired
      return res.status(401).send("token invalid");
    }

    // Optionally, you can attach the decoded token to the request
    // so that subsequent middleware or routing logic can use the token's payload
    req.decodedToken = decodedToken;

    // Token is valid, proceed with the request
    next();
  });
};
