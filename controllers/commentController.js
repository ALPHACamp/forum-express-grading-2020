const { Comment } = require('../models')
const { getUser } = require('../_helpers')

const commentController = {
  postComment: async (req, res) => {
    const user_id = getUser(req).id
    const { text, restaurantId } = req.body
    try {
      await Comment.create({
        text,
        UserId: user_id,
        RestaurantId: restaurantId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (e) {
      console.warn(e)
    }
  },
  deleteComment: async (req, res) => {
    const comment_id = req.params.id
    try {
      let comment = await Comment.findByPk(comment_id)
      await comment.destroy()

      return res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = commentController