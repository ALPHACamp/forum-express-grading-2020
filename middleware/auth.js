module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error_msg', '請先登入後才可使用')
    res.redirect('/users/signIn')
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next()
    }
    req.flash('error_msg', '您沒有此功能的權限')
    res.redirect('/users/signIn')
  }
}