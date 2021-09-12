// 再來打開 restController.js，加上負責處理瀏覽餐廳頁面的 function，我們將這個功能命名叫 getRestaurants

const restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController