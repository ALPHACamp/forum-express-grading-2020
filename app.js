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
const PORT = process.env.PORT || 3000

// -----------------------------------------------------------------------------------

app.engine('handlebars', handlebars({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 這是因為我們剛剛建立了 upload 資料夾來存放圖片，可是卻沒有設定 express 的路由，因此外界沒辦法存取到 / upload 這個路徑. 設定靜態檔案路徑 /upload
app.use('/upload', express.static(__dirname + '/upload'))

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})

module.exports = app