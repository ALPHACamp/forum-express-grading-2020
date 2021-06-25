const db = require('../models')
const helpers = require('../_helpers')
const Comment = db.Comment

let CommentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: helpers.getUser(req).id
    })
      .then(() => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
        comment.destroy()
          .then(() => {
            return res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }

}

module.exports = CommentController