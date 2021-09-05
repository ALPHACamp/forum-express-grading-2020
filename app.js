const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('./config/passport')


const app = express()
const PORT = process.env.PORT || 3000

//加在 Passport 之前
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// setup handlebars / bodyParser / session / passport /flash / methodOverride / upload
app.engine('handlebars', handlebars({
  defaultLayout : 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))



// 把 req.flash 放到 res.locals 裡
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`)
})
module.exports = app


//需放最後 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app, passport)
