const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// -----------------------------------------------------------------------------------

const session = require('express-session')
const passport = require('./config/passport')

// -----------------------------------------------------------------------------------

const app = express()
const PORT = process.env.PORT || 3000

// -----------------------------------------------------------------------------------

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: true }))
// 使用表單傳輸檔案時，會改用 multipart / form - data
app.use(bodyParser.json())


app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())


app.use(methodOverride('_method'))


app.use('/upload', express.static(__dirname + '/upload'))

// -----------------------------------------------------------------------------------

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// -----------------------------------------------------------------------------------

// require('./routes')(app, passport)
// 現在因為分了兩層，所以 index.js 不需要用到 passport 了，請把 app.js 單純改成傳入 app 就好：
require('./routes')(app)

// -----------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})

module.exports = app