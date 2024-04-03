module.exports = function (req, res, next) {
    if (!req.body.username || typeof req.body.username !== 'string') {
      res.status(400).json({ message: 'Username is required and must be a string' });
    } else {
      // Check if the username exists in your database or any other storage mechanism
      // You can implement your own logic here
      // For demonstration purposes, let's assume the username already exists
      const usernameExists = true;
  
      if (usernameExists) {
        res.status(400).json({ message: 'Username already exists' });
      } else {
        next();
      }
    }
  }
  