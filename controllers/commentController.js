const db = require('../models')
const Comment = db.Comment

const commentController = {

  // 新增一則評論
  postComment: async (req, res) => {
    const { text, restaurantId } = req.body
    const id = req.user.id
    try {
      Comment.create({ text, RestaurantId: restaurantId, UserId: id })
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (e) {
      console.log(e)
    }
  },

  // 刪除一則評論
  deleteComment: async (req, res) => {
    const id = req.params.id
    try {
      const comment = await Comment.findByPk(id)
      comment.destroy()
      return res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = commentController
