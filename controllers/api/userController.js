const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

const userController = {

  // 註冊 post
  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    }
    try {
      const user = await User.findOne({ where: { email } })
      if (user) return res.json({ status: 'error', message: '信箱重複！' })
      User.create({
        name,
        email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })
      return res.json({ status: 'success', message: '成功註冊帳號！' })
    } catch (e) {
      console.log(e)
    }
  },

  // 登入 post
  signIn: async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.json({ status: 'error', message: '請填入帳號密碼' })
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(401).json({ status: 'error', message: '信箱尚未註冊' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼不對' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: { ...user }
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = userController
