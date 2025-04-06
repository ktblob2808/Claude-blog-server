var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressJWT = require("express-jwt");
const { syncDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const { formatResponse } = require('./utils/tool');
const md5 = require('md5');
const { ForbiddenError, ServiceError, UnknownError } = require('./errors/index');

// Load environment variables from .env file in the project root directory
require("dotenv").config(); 

// Import database connection
require("./utils/dbConnect");

// Import routes
const adminRoutes = require('./routes/admin');
const captchaRouter = require('./routes/captcha');
const bannerRoutes = require('./routes/banner'); // Import the new banner routes
const uploadRouter = require('./routes/upload');
const blogTypeRouter = require('./routes/blogType');
const blogRouter = require('./routes/blog'); // Add this line to import blog routes
const demoRouter = require('./routes/demo'); // Add this line to import demo routes

// Import banner seed function
const { seedBannerData } = require('./models/bannerModel');

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

app.use(expressJWT({
  secret : md5(process.env.JWT_SECRET), 
  algorithms : ['HS256'], 
}).unless({
  path : [
    {"url" : "/api/admin/login", methods : ["POST"]},
    {"url" : "/api/admin", methods : ["PUT"]},
    {"url" : "/res/captcha", methods : ["GET"]},
    {"url" : "/api/banner", methods : ["GET"]},
    {"url" : "/api/blogtype", methods : ["GET"]},
    {"url" : "/api/blog", methods : ["GET"]},
    {"url" : /\/api\/blog\/\d/, methods : ["GET"]}, // Exclude from token checking
    {"url" : "/api/project", methods : ["GET"]}, // Add demo project routes to public access
    {"url" : /\/api\/project\/\d/, methods : ["GET"]} // Add demo project detail route to public access
  ]
}))

app.use('/api/admin', adminRoutes);
app.use('/res', captchaRouter);
app.use('/api/banner', bannerRoutes); // Add the banner routes
app.use('/api', uploadRouter);
app.use('/api/blogtype', blogTypeRouter);
app.use('/api/blog', blogRouter); // Add this line to register blog routes
app.use('/api/project', demoRouter); // Add this line to register demo routes under /api/project

// Sync database when application starts
syncDatabase().then(() => {
  console.log('Database setup complete');
  // Seed banner data after database is synced
  seedBannerData().catch(err => console.error('Error seeding banner data:', err));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  
  if (err.name === 'UnauthorizedError') {
    res.send(new ForbiddenError("login fail, Or login expired").response());
  } else if(err instanceof ServiceError){
    res.send(err.response());
  } else {
    res.send(new UnknownError().response());
  }
});

module.exports = app;
