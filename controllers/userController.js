const { User, Comment, Restaurant, Favorite } = require('../models')

const _helpers = require('../_helpers')

// error handle method
const {
  allValidationError,
  errorMsgToArray
} = require('../utils/errorHandleHelper')

const imgurUpload = require('../utils/imgurUpload')

const signUpPage = (req, res) => {
  return res.render('signup')
}

const signUp = async (req, res) => {
  // password check
  if (req.body.password !== req.body.passwordCheck) {
    const validationErrorMsg = ['密碼不同']
    return res.render('signup', { user: req.body, validationErrorMsg })
  }
  // check user
  const user = await User.findOne({ where: { email: req.body.email } })
  if (user) {
    const validationErrorMsg = ['email 已註冊']
    return res.render('signup', { user: req.body, validationErrorMsg })
  }
  try {
    await User.create(req.body)
    req.flash('success_messages', '註冊成功')
    return res.redirect('/signin')
  } catch (err) {
    if (allValidationError(err.errors)) {
      const validationErrorMsg = errorMsgToArray(err.message)
      return res.render('signup', { user: req.body, validationErrorMsg })
    } else {
      console.error(err)
    }
  }
}

const signInPage = (req, res) => {
  return res.render('signin')
}

// sign in successfully
const signIn = (req, res) => {
  req.flash('success_messages', '登入成功')
  return res.redirect('/restaurants')
}

const logout = (req, res) => {
  req.flash('success_messages', '登出成功')
  req.logout()
  return res.redirect('/signin')
}

const getUser = async (req, res) => {
  const user = await checkUserAndReturn(req, res)
  return res.render('user', { displayUser: user.toJSON() })
}

const editUser = async (req, res) => {
  const user = await checkUserAndReturn(req, res)
  if (user.id !== _helpers.getUser(req).id) {
    return res.redirect('back')
  }
  return res.render('userEdit', { displayUser: user.toJSON() })
}

const putUser = async (req, res) => {
  const { file } = req
  try {
    const user = await checkUserAndReturn(req, res)
    if (file) {
      const img = await imgurUpload(file)
      await user.update({
        name: req.body.name,
        image: img.data.link
      })
    } else {
      await user.update({
        name: req.body.name,
        image: user.image
      })
    }
    req.flash('success_messages', '個人檔案更新成功')
    return res.redirect(`/users/${user.id}`)
  } catch (err) {
    console.error(err)
  }
}

const addFavorite = async (req, res) => {
  const restaurant = await checkRestaurantAndReturn(req, res)
  await Favorite.create({
    UserId: _helpers.getUser(req).id,
    RestaurantId: restaurant.id
  })
  return res.redirect('back')
}

const removeFavorite = async (req, res) => {
  const restaurant = await checkRestaurantAndReturn(req, res)
  const favorite = await Favorite.findOne({
    where: {
      UserId: _helpers.getUser(req).id,
      RestaurantId: restaurant.id
    }
  })
  if (!favorite) {
    req.flash('error_messages', '無此 id 收藏紀錄')
    return res.redirect('back')
  }

  await favorite.destroy()
  return res.redirect('back')
}

const checkUserAndReturn = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Comment,
        include: [Restaurant]
      }
    ]
  })
  if (!user) {
    req.flash('error_messages', '無此使用者 id')
    return res.redirect(`/users/${_helpers.getUser(req).id}`)
  }
  return user
}

const checkRestaurantAndReturn = async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id)
  if (!restaurant) {
    req.flash('error_messages', '無此餐廳 id')
    return res.redirect('back')
  }
  return restaurant
}

module.exports = {
  signUpPage,
  signUp,
  signInPage,
  signIn,
  logout,
  getUser,
  editUser,
  putUser,
  addFavorite,
  removeFavorite
}
