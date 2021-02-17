const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const app = express()
const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', hbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')  
}))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({ secret: 'JacksonSecret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.listen(PORT, () => {
  console.log(`The server is listening to http://localhost:${PORT}.`)
})

require('./routes')(app)

module.exports = app
