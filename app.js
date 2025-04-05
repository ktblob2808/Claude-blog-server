var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const { syncDatabase } = require('./utils/db');

// Load environment variables from .env file in the project root directory
require("dotenv").config(); 

// Import database connection
require("./utils/dbConnect");

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRoutes = require('./routes/admin');

var app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/admin', adminRoutes);

// Sync database when application starts
syncDatabase().then(() => {
  console.log('Database setup complete');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  
  if (typeof err.response === 'function') {
    return res.status(err.code || 500).json(err.response());
  }
  
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 500
    }
  });
});



module.exports = app;
