const passport = require('./config/passport')
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
var mysql = require('mysql');

var db_config = {
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'baacdf01408880',
  password: 'ed18bc9f',
  database: 'heroku_a094e57629ef1fa'
};

var connection;


// 產生flash並放到session
const flash = require('connect-flash')
const session = require('express-session')

// 封裝測試
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000
app.use(express.logger());

app.engine('handlebars', handlebars({ 
  defaultLayout: 'main', 
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')


app.use(session({ secret:'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

// 使用passport
app.use(passport.initialize()) // 初始化
app.use(passport.session()) // 資料存放在session

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = helpers.getUser(req) // 封裝測試
  next()
})

function handleDisconnect() {
  console.log('1. connecting to db:');
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              	// The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('2. error when connecting to db:', err);
      setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
    }                                     	// to avoid a hot loop, and to allow our node script to
  });                                     	// process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('3. db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
      handleDisconnect();                      	// lost due to either server restart, or a
    } else {                                      	// connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.get('/', function (request, response) {
  connection.query('SELECT * from t_users', function (err, rows, fields) {
    if (err) {
      console.log('error: ', err);
      throw err;
    }
    response.send(['Hello World!!!! HOLA MUNDO!!!!', rows]);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 把express() & passport 回傳給routes
require('./routes')(app, passport)

module.exports = app