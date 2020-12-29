const helpers = require('../_helpers');

const adminRouter = require('./adminRouter');
const rootRouter = require('./rootRouter');
const restRouter = require('./restRouter');
const commentRouter = require('./commentRouter');
const userRouter = require('./userRouter');

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    res.redirect('/signin');
  };
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next();
      }
      return res.redirect('/');
    }
    res.redirect('/signin');
  };
  app.use('/', rootRouter);
  app.use('/', authenticated, restRouter);
  app.use('/comments', authenticatedAdmin, commentRouter);
  app.use('/comments', authenticated, commentRouter);
  app.use('/users', authenticated, userRouter);
  app.use('/admin', authenticatedAdmin, adminRouter);
};
