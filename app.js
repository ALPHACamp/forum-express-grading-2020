const express = require('express')
const exphdbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const db = require('./models')
const app = express()
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// Define server info
const PORT = process.env.PORT

// Setting express-handlebars
app.engine(
  'hbs',
  exphdbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'hbs')

// Setting body-parser
app.use(express.urlencoded({ extended: true }))

// Setting express-session
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true
  })
)

// Setting passport
app.use(passport.initialize())
app.use(passport.session())

// Setting connect-flash
app.use(flash())

// Setting middleware to store info into res.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

// setting static files
app.use('/upload', express.static(__dirname + '/upload'))

// Setting middleware: method-override
app.use(methodOverride('_method'))

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

// Introduce routes and pass in app, so that routes can use the app object to specify routes
require('./routes')(app, passport)

module.exports = app
