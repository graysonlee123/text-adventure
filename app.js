var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// automate inclusion of new route files
const requireDir = require('require-dir');
const routes = requireDir('./routes');

Object.keys(routes).forEach(file => {
  let cnt = routes[file];
  app.use('/' + file, cnt);
});

// error handler
app.use(function(err, req, res, next) {
  // render err page
  if (typeof err === 'string') {
    err = {
      status: 500,
      message: err
    };
  }

  res.status(err.status || 500);
  let errorObj = {
    error: true,
    msg: err.message,
    errCode: err.status || 500
  };

  if (err.trace) {
    errorObj.trace = err.trace;
  }

  res.json(errorObj);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
