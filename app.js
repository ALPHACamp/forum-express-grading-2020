const express = require('express')
const exphbs = require('express-handlebars')
const db =require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const port = process.env.PORT || 3000

app.use('/upload', express.static(__dirname + '/upload'))
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs', helpers: require('./config/handlebars-helpers')}) )
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({secret: 'secret', resave: false, saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
