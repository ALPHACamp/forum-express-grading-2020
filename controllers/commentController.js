const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId, //req.params.id
      UserId: req.user.id
    })
      .then(comment => res.redirect(`/restaurants/${req.body.restaurantId}`))
  }
}

module.exports = commentController