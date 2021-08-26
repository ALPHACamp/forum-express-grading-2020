const express = require('express')
const exphdbs = require('express-handlebars')
const app = express()
const port = 3000

// Setting express-handlebars
app.engine(
  'hbs',
  exphdbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
)
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Introduce routes and pass in app, so that routes can use the app object to specify routes
require('./routes')(app)

module.exports = app
