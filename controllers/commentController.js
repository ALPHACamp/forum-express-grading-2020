const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(() => {
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id).then((comment) => {
      comment.destroy().then(() => {
        req.flash('success_messages', '成功刪除評論！')
        res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
    })
  }
}
module.exports = commentController