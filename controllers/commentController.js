const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      return console.warn(err)
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (err) {
      return console.warn(err)
    }
  }
}

module.exports = commentController