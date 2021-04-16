// const passport = require('passport')

// const authenticated = passport.authenticate('jwt', { session: false })

// const authenticatedAdmin = (req, res, next) => {
//   if (req.user) {
//     if (req.user.isAdmin) { return next() }
//     return res.json({ status: 'error', message: 'permission denied' })
//   } else {
//     return res.json({ status: 'error', message: 'permission denied' })
//   }
// }

// module.exports = { authenticated, authenticatedAdmin }
