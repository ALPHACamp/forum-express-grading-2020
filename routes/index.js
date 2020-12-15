const adminRouter = require('./adminRouter');
const rootRouter = require('./rootRouter');
const restRouter = require('./restRouter');

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
  };
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect('/');
    }
    res.redirect('/signin');
  };
  app.use('/', rootRouter);
  app.use('/', authenticated, restRouter);
  app.use('/admin', authenticatedAdmin, adminRouter);
};
