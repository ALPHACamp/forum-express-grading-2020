const passport = require('./config/passport')
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


// 產生flash並放到session
const flash = require('connect-flash')
const session = require('express-session')

// 封裝測試
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000


app.engine('handlebars', handlebars({ 
  defaultLayout: 'main', 
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')


app.use(session({ secret:'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

// 使用passport
app.use(passport.initialize()) // 初始化
app.use(passport.session()) // 資料存放在session

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = helpers.getUser(req) // 封裝測試
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 把express() & passport 回傳給routes
require('./routes')(app, passport)

module.exports = app