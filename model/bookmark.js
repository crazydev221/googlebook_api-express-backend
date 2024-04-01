const Sequelize = require('sequelize');

// Configure Sequelize
const sequelize = new Sequelize('googlebook_backend', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const BookmarkModel = sequelize.define('bookmarks', {
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  id: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true
  },
  title: Sequelize.STRING,
  author: Sequelize.STRING,
  link: Sequelize.STRING
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

module.exports = BookmarkModel;
