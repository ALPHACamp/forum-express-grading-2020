const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app

console.log('test')
console.log('test')
console.log('test')
console.log('test')
console.log('test')