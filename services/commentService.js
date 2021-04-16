/* eslint-disable node/no-callback-literal */
const db = require('../models')
const Comment = db.Comment

const commentService = {
  postComment: async (req, res, callback) => {
    const { text, restaurantId } = req.body
    const id = req.user.id
    try {
      await Comment.create({ text, RestaurantId: restaurantId, UserId: id })
      return callback({
        status: 'success',
        message: '成功新增一則評論',
        RestaurantId: restaurantId
      })
    } catch (e) {
      console.log(e)
    }
  },
  deleteComment: async (req, res, callback) => {
    const id = req.params.id
    try {
      const comment = await Comment.findByPk(id)
      const restaurantId = comment.RestaurantId
      comment.destroy()
      return callback({
        status: 'success',
        message: '成功刪除一則評論',
        RestaurantId: restaurantId
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = commentService
