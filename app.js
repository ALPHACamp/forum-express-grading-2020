const express = require('express');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const db = require('./models');
const passport = require('./config/passport');

const app = express();
const port = 3000;

app.engine('handlebars', handlebars({ defaultLayout: 'main' })); // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars'); // 設定使用 Handlebars 做為樣板引擎
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require('./routes')(app, passport);

module.exports = app;
