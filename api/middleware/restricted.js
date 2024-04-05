const jwt = require('jsonwebtoken');

// Assuming 'YOUR_SECRET_KEY' is the secret key you used to sign the JWTs.
const SECRET_KEY = process.env.SECRET || 'YOUR_SECRET_KEY';




module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Verification error:", err); // Add this line for debugging
        return res.status(401).json({ message: "token invalid" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "token required" });
  }

  
  
};