const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const helpers = require('./helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models')
const passport = require('./config/passport.js')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.listen(port, () => {
  // db.sequelize.sync()
  console.log(`Example app listening on port ${port}!`)
})

require('./routes')(app, passport)

module.exports = app
