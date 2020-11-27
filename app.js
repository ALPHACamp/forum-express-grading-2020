// require packages
const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport.js')
const flash = require('connect-flash')

// set env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// define server related variables
const app = express()
const PORT = process.env.PORT

// set view engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({ secret: 'WhySoSerious', resave: false, saveUninitialized: false }))
app.use(flash())
usePassport(app)
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

require('./routes')(app)

module.exports = app
