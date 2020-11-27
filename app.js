const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

// -----------------------------------------------------------------------------------

const app = express()
const port = 3000

// -----------------------------------------------------------------------------------

app.engine('handlebars', handlebars({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// -----------------------------------------------------------------------------------

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// -----------------------------------------------------------------------------------

app.use(passport.initialize())
app.use(passport.session())

// -----------------------------------------------------------------------------------

require('./routes')(app, passport)

// -----------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

module.exports = app