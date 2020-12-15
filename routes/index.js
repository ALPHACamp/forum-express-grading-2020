const restController = require('../controllers/restController.js');
const adminRouter = require('./adminRouter');
const rootRouter = require('./rootRouter');

module.exports = (app) => {
  app.use('/', rootRouter);
  app.use('/admin', adminRouter);
};
