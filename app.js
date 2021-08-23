const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000
const db = require('./models')

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) //handlebars註冊樣板engine
app.set('view engine', 'handlebars') //設定使用handlebars作為樣板engine

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
