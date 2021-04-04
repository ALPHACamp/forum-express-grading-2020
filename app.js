const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const userPassport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

// eslint-disable-next-line node/no-path-concat
app.use('/upload', express.static(__dirname + '/upload'))

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({ secret: 'Secret', resave: false, saveUninitialized: false }))
app.use(flash())

app.use(methodOverride('_method'))

userPassport(app)

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

require('./routes')(app)

app.listen(PORT, () => {
  console.log(`The server is running on localhost:${PORT}`)
})
