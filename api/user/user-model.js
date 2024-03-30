const Sequelize = require('sequelize');
const sequelize = require('../../data/connection'); // Adjust the import based on your setup

const User = sequelize.define('user', {
  // Assuming id is auto-generated
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;