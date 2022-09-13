var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongodbConnection = require('./config/Mongodb');
var logger = require('morgan');
const cors = require('cors');
const wlogger = require('./config/Logger');
require('dotenv').config();
const allRoutes = require('./routes');

var app = express();
mongodbConnection();

// const allowlist = ['http://localhost:4200', 'http://localhost:3000'];
// const corsOptionsDelegate = (req, callback) => {
//   let corsOptions;
//   let isDomainAllowed = whitelist.indexOf(req.header('Origin')) !== -1;
//   if (isDomainAllowed && isExtensionAllowed) {
//     // Enable CORS for this request
//     corsOptions = { origin: true }
//   } else {
//       // Disable CORS for this request
//       corsOptions = { origin: false }
//   }
//   callback(null, corsOptions)
// };

const corsOptions = {
  origin: ['http://localhost:3000', 'https://ladies-point.web.app'],
  optionsSuccessStatus: 200, // For legacy browser support
  methods: '*'
};

// middleware
app.use(cors(corsOptions));
app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/api/v1', allRoutes);
app.use('/', (req, res) => {
  const defaultData = {
    status: 'Not Found!!'
  };
  res.status(404).send(defaultData);
});

//static Images Folder
app.use('/Images', express.static('./Images'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
