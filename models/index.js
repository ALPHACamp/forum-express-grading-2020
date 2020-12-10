'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// -----------------------------------------------------------------------------------第一段：與資料庫連線

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// -----------------------------------------------------------------------------------第二段：動態引入其他 models

fs // file system
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// -----------------------------------------------------------------------------------第三段：設定 Models 之間的關聯

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// -----------------------------------------------------------------------------------第四段：匯出需要的物件

db.sequelize = sequelize; // 代表連線資料庫的 instance
db.Sequelize = Sequelize; // 存取到 Sequelize 這個 class，代表 Sequelize 函式庫本身
// 兩個看起來很像，但一個是小寫開頭一個是開寫，前者是 instance，後者是 Class，小心不要搞混了

module.exports = db;
