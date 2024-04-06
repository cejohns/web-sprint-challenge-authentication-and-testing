const jwt = require('jsonwebtoken');

// Assuming 'YOUR_SECRET_KEY' is the secret key you used to sign the JWTs.
const SECRET_KEY = process.env.SECRET || 'the secret';




module.exports = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    // Check if token is prefixed with 'Bearer '
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    } else {
      token = req.headers.authorization;
    }
  }

  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "token invalid" });
    } else {
      req.token = decoded;
      next();
    }
  });

  
  };
