if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const db = require('./models') // 引入資料庫
const app = express()
const port = process.env.PORT || 3000

// 設定靜態檔案路徑 /upload
app.use('/upload', express.static(__dirname + '/upload'))

// Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
// session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// passport
app.use(passport.initialize())
app.use(passport.session())
// flash
app.use(flash())
// method-override
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 引入 routes 並將 app, passport 傳進去
require('./routes')(app, passport)

module.exports = app
