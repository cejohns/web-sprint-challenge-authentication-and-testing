const User = require('../users/users-model'); // Adjust the path as necessary

module.exports = async function (req, res, next) {
  const { username } = req.body;
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Username is required and must be a string' });
  }
  
  try {
    // Assuming findByUsername is a method that exists and works as intended
    // The use of .first() may depend on your ORM or database querying library, 
    // ensure it's applicable for your scenario
    const user = await User.findByUsername(username); 
    if (user) {
      req.user = user; // Attach user to the request for downstream use
      next();
    } else {
      return res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error accessing the database' });
  }
};
