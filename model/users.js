const Sequelize = require('sequelize');

// Configure Sequelize
const sequelize = new Sequelize('googlebook_backend', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const UserModel = sequelize.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true
  },
  password: Sequelize.STRING,
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

module.exports = UserModel;
