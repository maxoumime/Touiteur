var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var login = require('./routes/login');
var logout = require('./routes/logout');
var user = require('./routes/user');
var touite = require('./routes/touite');
var motdiese = require('./routes/motdiese');
var stalk = require('./routes/stalk');
var stalkers = require('./routes/stalkers');
var stalking = require('./routes/stalking');

var db = require('./services/db/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);
app.use('/touite', touite);
app.use('/motdiese', motdiese);
app.use('/stalk', stalk);
app.use('/stalkers', stalkers);
app.use('/stalking', stalking);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end();
});

module.exports = app;


process.stdin.resume();

function exitHandler() {
    db.exitClients();
    process.exit();
}

//Action à l'arrêt
process.on('exit', exitHandler.bind(null));

//Action au Ctrl+C
process.on('SIGINT', exitHandler.bind(null));