if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const db = require('./models');
const passport = require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', handlebars({ defaultLayout: 'main' })); // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars'); // 設定使用 Handlebars 做為樣板引擎
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/upload', express.static(`${__dirname}/upload`));

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = req.user;
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require('./routes')(app, passport);

module.exports = app;
