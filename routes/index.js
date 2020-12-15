const restController = require('../controllers/restController.js');
const adminRouter = require('./adminRouter');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/restaurants');
  });
  app.get('/restaurants', restController.getRestaurants);
  app.use('/admin', adminRouter);
};
