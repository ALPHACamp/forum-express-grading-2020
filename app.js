const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const db = require('./models')
const { urlencoded } = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const usePassport = require('./config/passport')
const helpers = require('./_helpers')
const hbsHelpers = require('./config/handlebars-helpers')

require('./config/dotent').loadEnv()
const port = process.env.PORT || 3000

//view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: hbsHelpers }))
app.set('view engine', 'hbs')

//bodyParser
app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))
//session
app.use(session({
  secret: 'GreenFrog',
  resave: false,
  saveUninitialized: true
}))

//usePassport
usePassport(app)

//flash
app.use(flash())

//path
app.use('/upload', express.static(__dirname + '/upload'))

//listening
app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use((req, res, next) => {
  const user_from_passport = helpers.getUser(req)
  const isAdmin = () => {
    let isAdminPath = req.path.includes('/admin/')
    let haveAdmin = user_from_passport ? user_from_passport.isAdmin : false
    return isAdminPath && haveAdmin
  }
  res.locals.isAdmin = isAdmin()
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  res.locals.user = user_from_passport
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  return next()
})

require('./routes')(app, passport)

module.exports = app
