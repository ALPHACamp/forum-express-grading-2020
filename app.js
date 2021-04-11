const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('./models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const port = process.env.PORT || 3000
const helpers = require('./_helpers')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'YouWillNeverKnow',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = helpers.getUser(req)
  next()
})
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

require('./routes')(app, passport)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
