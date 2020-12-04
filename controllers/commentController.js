const db = require('../models')
const comment = require('../models/comment')
const Comment = db.Comment

const commentController = {
    postComment: (req, res) => {
        Comment.create({
            text: req.body.text,
            RestaurantId: req.body.restaurantId,
            UserId: req.user.id
        })
            .then(() => res.redirect(`/restaurants/${req.body.restaurantId}`))
    },
    deleteComment: (req, res) => {
        Comment.findByPk(req.params.id)
            .then(comment => {
                comment.destroy()
                return res.redirect(`/restaurants/${comment.RestaurantId}`)
            })
    }
}

module.exports = commentController