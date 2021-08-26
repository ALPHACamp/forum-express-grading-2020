const express = require('express')
const exphdbs = require('express-handlebars')
const db = require('./models')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// Define server info
const PORT = process.env.PORT

// Setting express-handlebars
app.engine(
  'hbs',
  exphdbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
)
app.set('view engine', 'hbs')

// Setting body-parser
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

// Introduce routes and pass in app, so that routes can use the app object to specify routes
require('./routes')(app)

module.exports = app
