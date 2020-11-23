const express = require('express')
const exhbs = require('express-handlebars')
const app = express()
const port = 3000

app.engine('handlebars', exhbs())
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
