const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000
const db = require('./models')

app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
