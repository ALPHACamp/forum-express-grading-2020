const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const db = require('./models')
const app = express()
const port = 3000


app.engine('handlebars', handlebars()) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app