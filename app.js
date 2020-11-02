const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const db = require("./models");
const app = express();
const port = 3000;
const flash = require("connect-flash");
const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", handlebars()); // Handlebars 註冊樣板引擎
app.set("view engine", "handlebars"); // 設定使用 Handlebars 做為樣板引擎
// 設定 view engine 使用 handlebars
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require("./routes")(app);

module.exports = app;
