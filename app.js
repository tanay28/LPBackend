var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const wlogger = require('./config/Logger');
require('dotenv').config();
const allRoutes = require('./routes');

var app = express();

const corsOptions = {
  origin: 'http://localhost:4200'
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
