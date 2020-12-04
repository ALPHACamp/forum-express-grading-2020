const exphbs = require('express-handlebars')

module.exports = app => {
  // set view engine
  app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: require('./handlebars-helpers')
  }))
  app.set('view engine', 'handlebars')
}