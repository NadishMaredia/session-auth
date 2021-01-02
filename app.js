var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
//MONGODB CONN
var mongoose = require('mongoose');
var mongoStr = 'mongodb://localhost/gitAuth';
mongoose.connect(mongoStr, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log('Db error '+err));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'mysandjvbsjdvsjdv',
  saveUninitialized:false,
  key:'user_sid',
  resave:false,
  cookie:{
    expires: 600000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
})

app.use('/', authRouter);

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

app.listen(3000, () => console.log('Listening on 3000'));

module.exports = app;
