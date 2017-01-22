var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/scripts', express.static(path.join(__dirname, 'aurelia', 'scripts')));



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'aurelia', 'index.html'));
});

app.use('/api/users', require('./controllers/user'));
app.use('/api/questions', require('./controllers/question'));
app.use('/api/answers', require('./controllers/answer'));
app.use('/api/pin', require('./controllers/pin'));
app.use('/api/auth', require('./auth/local'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
});

module.exports = app;
