const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const db = require('./models')
const bodyParser = require('body-parser')

// -----------------------------------------------------------------------------------

const app = express()
const port = 3000

// -----------------------------------------------------------------------------------

app.engine('handlebars', handlebars({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.use(bodyParser.urlencoded({ extended: true }))


// -----------------------------------------------------------------------------------

require('./routes')(app)

// -----------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

module.exports = app