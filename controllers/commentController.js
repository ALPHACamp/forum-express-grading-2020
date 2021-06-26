const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body

    return Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId: req.user.id
    }).then(comment => {
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        return comment.destroy()
      })
      .then(comment => {
        return res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
  }
}

module.exports = commentController