const express = require('express')
const hbs = require('express-handlebars')
const app = express()
const PORT = 3000

app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`The server is listening to http://localhost:${PORT}.`)
})

require('./routes')(app)

module.exports = app
