const express = require('express');
const handlebars = require('express-handlebars');
<<<<<<< HEAD
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const passport = require('./config/passport');
const db = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.use('/upload', express.static(__dirname + '/upload'));

app.engine(
  'hbs',
  handlebars({
    defaultLayout: 'main.hbs',
    helpers: require('./config/handlebars-helpers'),
  })
);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = req.user;
  next();
});

app.use(methodOverride('_method'));
=======
const app = express();
const port = 3000;

app.engine('hbs', handlebars());
app.set('view engine', 'hbs');
>>>>>>> c6d45c0... Initialize project

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require('./routes')(app);

module.exports = app;
