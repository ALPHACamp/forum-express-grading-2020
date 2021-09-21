const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000

// Handlebars 註冊樣板引擎, 設定使用 Handlebars 做為樣板引擎
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app
