// 一般使用者驗證
const authenticated = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect('/signin')
}

// 管理員驗證
const authenticatedAdmin = (req, res, next) => {
  req.isAuthenticated() && req.user.isAdmin ? next() : res.redirect('/signin')
}

// 檢查登入資料
const checkAccount = (req, res, next) => {
  const { email, password } = req.body
  if (!email && !password) {
    req.flash('error_messages', '請輸入信箱與密碼')
    return res.redirect('/signin')
  }
  if (!password) {
    req.flash('error_messages', '請輸入密碼')
    return res.redirect('/signin')
  }
  if (!email) {
    req.flash('error_messages', '請輸入帳號')
    return res.redirect('/signin')
  }
  return next()
}

module.exports = { authenticated, authenticatedAdmin, checkAccount }
