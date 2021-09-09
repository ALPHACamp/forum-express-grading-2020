const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    Comment.findOne({ where: { text: req.body.text } })
      .then(comment => {
        console.log(req.body.text)
        Comment.create({
          text: req.body.text,
          UserId: req.user.id,
          RestaurantId: req.body.restaurantId
        })
      })
      .then(() => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  }
}

module.exports = commentController