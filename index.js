const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// import the defined APIs
const authAPI = require('./api/auth/auth');
const bookmarkAPI = require('./api/bookmark/bookmark');
const mysqldb = require('./database/mysql');
const env = require('./const/env');

// Create Express app
const app = express();
const port = env.BACKEND_PORT;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Connect to MySQL
mysqldb.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Check the server is running
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Google Book Backend is working!'
    });
});

// Set the apis by url
app.use('/api/auth', authAPI);
app.use('/api/bookmark', bookmarkAPI);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
