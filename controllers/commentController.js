const db = require('../models')
const Comment = db.Comment
const User = db.User

const commentController = {
  postComment: (req, res) => {
    const comment = req.body
    comment.UserId = req.user.id
    Comment.create(comment).then(comment => {
      req.flash('success_messages', `your comment was posted successfully!`)
      res.redirect(`/restaurants/${comment.RestaurantId}`)
    })
  },

  deleteComment: (req, res) => {
    const { id } = req.params
    Comment.findByPk(id, { include: User }).then(comment => {
      comment.destroy().then(comment => {
        req.flash('success_messages', `${comment.User.name}'s comment was deleted successfully!`)
        res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
    })
  }
}

module.exports = commentController