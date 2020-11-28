const express = require('express')
const exphbs = require('express-handlebars')
const db =require('./models')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const port = 3000

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}) )
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({secret: 'secret', resave: false, saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
