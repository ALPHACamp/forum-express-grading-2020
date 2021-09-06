const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const session = require('express-session')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
// req.user -> helpers.getUser(req)

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
// const router = require('./routes')
// router(app)
require('./routes')(app)
module.exports = app
