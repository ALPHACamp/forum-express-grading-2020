const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res, next) => {
    req.body.UserId = req.user.id
    Comment.create(req.body)
      .then(() => { return res.redirect(`restaurants/${req.body.RestaurantId}`) })
      .catch(err => next(err))
  },

  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
        if (!comment) {
          req.flash('err_msg', '找不到該評論')
          return res.redirect(`/restaurants/${comment.RestaurantId}`)
        }
        return comment.destroy()
          .then(() => { return res.redirect(`/restaurants/${comment.RestaurantId}`) })
      })
      .catch(err => next(err))
  }
}

module.exports = commentController